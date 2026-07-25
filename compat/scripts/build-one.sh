#!/bin/sh
# Usage: build-one.sh <angular-major>
set -u

NG="$1"
OUT="/out/v${NG}"
LOG="${OUT}/build.log"
APP="/work/demo"

mkdir -p "${OUT}"
: >"${LOG}"

build() (
  set -x
  cd /work || exit 1
  rm -rf demo

  npx -y "@angular/cli@${NG}" new demo \
    --defaults \
    --skip-git \
    --skip-install \
    --skip-tests \
    --style=scss \
    --ssr=false || exit 1

  cd demo || exit 1

  node /scripts/patch-app.mjs || exit 1

  npm install || exit 1
  npm install /artifacts/ngx-colors.tgz || exit 1

  npx ng build --configuration production --base-href "/v${NG}/" || exit 1
)

STATUS=ok
if ! build >>"${LOG}" 2>&1; then
  STATUS=fail
fi

read_pkg_version() {
  # $1 = package name
  node -p "require('${APP}/node_modules/$1/package.json').version" 2>/dev/null || echo "n/a"
}

NODE_V="$(node -v 2>/dev/null || echo n/a)"
ANGULAR_V="$(read_pkg_version @angular/core)"
LIB_V="$(read_pkg_version ngx-colors)"
PEER_RANGE="$(node -p "JSON.stringify(require('${APP}/node_modules/ngx-colors/package.json').peerDependencies)" 2>/dev/null || echo "n/a")"

if [ -d "${APP}" ]; then
  (cd "${APP}" && npm ls @angular/core @angular/common ngx-colors 2>&1) >"${OUT}/deps.txt"
fi

if [ "${STATUS}" = ok ]; then
  IDX="$(find "${APP}/dist" -name index.html -not -path '*/server/*' 2>/dev/null | head -n 1)"
  if [ -n "${IDX}" ]; then
    cp -R "$(dirname "${IDX}")/." "${OUT}/"
  else
    STATUS=fail
    echo "ERROR: build reported success but no index.html was found under dist/" >>"${LOG}"
  fi
fi

{
  echo "version=${NG}"
  echo "status=${STATUS}"
  echo "node=${NODE_V}"
  echo "angular=${ANGULAR_V}"
  echo "ngxcolors=${LIB_V}"
  echo "peers=${PEER_RANGE}"
} >"${OUT}/info.txt"

echo "==> Angular ${NG}: ${STATUS} (@angular/core ${ANGULAR_V}, node ${NODE_V})"

rm -rf "${APP}"
exit 0
