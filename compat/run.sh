#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${HERE}/.." && pwd)"
ARTIFACTS="${HERE}/.artifacts"

IMAGE="ngx-colors-compat"
CONTAINER="ngx-colors-compat"
PORT="8080"
PEERS="^17.3.0 || ^18.0.0 || ^19.0.0 || ^20.0.0 || ^21.0.0 || ^22.0.0"
SERVE=1
BUILD_ARGS=()

usage() {
  cat <<'USAGE'
Usage: compat/run.sh [options]

  --peers <range>   peer range to stamp into the packed library before testing.
                    Use "keep" to test the range currently in
                    projects/ngx-colors/package.json unchanged.
                    (default: ^17.3.0 || ^18.0.0 || ... || ^22.0.0)
  --port <n>        host port for the served matrix (default: 8080)
  --no-cache        force a full rebuild of every Angular version
  --no-serve        build the image and print the matrix, but do not run it
  -h, --help        show this help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --peers) PEERS="$2"; shift 2 ;;
    --port) PORT="$2"; shift 2 ;;
    --no-cache) BUILD_ARGS+=(--no-cache); shift ;;
    --no-serve) SERVE=0; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

echo "==> Building the library"
(cd "${ROOT}" && npm run build:lib)

if [[ "${PEERS}" != "keep" ]]; then
  echo "==> Stamping peer range into the packed library: ${PEERS}"
  PEERS="${PEERS}" node -e '
    const fs = require("fs");
    const path = process.argv[1];
    const pkg = JSON.parse(fs.readFileSync(path, "utf8"));
    for (const name of Object.keys(pkg.peerDependencies ?? {})) {
      if (name.startsWith("@angular/")) pkg.peerDependencies[name] = process.env.PEERS;
    }
    fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + "\n");
  ' "${ROOT}/dist/ngx-colors/package.json"
else
  echo "==> Testing the peer range as declared in the library"
fi

echo "==> Packing"
rm -rf "${ARTIFACTS}"
mkdir -p "${ARTIFACTS}"
(cd "${ROOT}" && npm pack ./dist/ngx-colors --pack-destination "${ARTIFACTS}" >/dev/null)
mv "${ARTIFACTS}"/ngx-colors-*.tgz "${ARTIFACTS}/ngx-colors.tgz"

echo "==> Building the compatibility matrix (this takes a while on a cold cache)"
docker build "${BUILD_ARGS[@]}" -t "${IMAGE}" "${HERE}"

echo
echo "==> Results"
docker run --rm --entrypoint sh "${IMAGE}" -c '
  for f in /usr/share/nginx/html/v*/info.txt; do
    v=$(sed -n "s/^version=//p" "$f")
    s=$(sed -n "s/^status=//p" "$f")
    a=$(sed -n "s/^angular=//p" "$f")
    printf "  Angular %-3s %-7s @angular/core %s\n" "$v" "$s" "$a"
  done
'

if [[ "${SERVE}" -eq 1 ]]; then
  docker rm -f "${CONTAINER}" >/dev/null 2>&1 || true
  docker run -d --name "${CONTAINER}" -p "${PORT}:80" "${IMAGE}" >/dev/null
  echo
  echo "==> Serving on http://localhost:${PORT}"
  echo "    stop with: docker rm -f ${CONTAINER}"
fi
