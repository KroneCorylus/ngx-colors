#!/bin/sh
set -eu

ROOT="${1:-/usr/share/nginx/html}"
OUT="${ROOT}/index.html"

field() {
  sed -n "s/^$1=//p" "$2" | head -n 1
}

{
  cat <<'HTML'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ngx-colors — Angular compatibility matrix</title>
<style>
  body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 2.5rem 1.5rem; }
  main { max-width: 56rem; margin: 0 auto; }
  h1 { font-size: 1.5rem; margin: 0 0 0.35rem; }
  p.lead { color: #64748b; margin: 0 0 1.75rem; font-size: 0.9rem; }
  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e2e8f0; border-radius: 0.75rem; overflow: hidden; }
  th, td { text-align: left; padding: 0.7rem 0.9rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }
  th { background: #f1f5f9; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
  tr:last-child td { border-bottom: none; }
  .ok { color: #15803d; font-weight: 600; }
  .fail { color: #b91c1c; font-weight: 600; }
  code { font-family: ui-monospace, monospace; font-size: 0.8rem; color: #475569; }
  a { color: #0284c7; }
  .peers { margin-top: 1.5rem; font-size: 0.8rem; color: #64748b; }
</style>
</head>
<body>
<main>
<h1>ngx-colors — Angular compatibility matrix</h1>
<p class="lead">Each row is a stock <code>ng new</code> app built by that major's own CLI, with ngx-colors installed under strict peer resolution.</p>
<table>
<thead><tr><th>Angular</th><th>Build</th><th>@angular/core</th><th>Node</th><th>Demo</th><th>Log</th></tr></thead>
<tbody>
HTML

  PEERS=""
  LIB=""
  for dir in $(ls -d "${ROOT}"/v*/ 2>/dev/null | sort -V); do
    info="${dir}info.txt"
    [ -f "${info}" ] || continue
    v="$(field version "${info}")"
    status="$(field status "${info}")"
    angular="$(field angular "${info}")"
    node="$(field node "${info}")"
    PEERS="$(field peers "${info}")"
    LIB="$(field ngxcolors "${info}")"

    if [ "${status}" = "ok" ]; then
      cell='<span class="ok">passed</span>'
      demo="<a href=\"/v${v}/\">open demo</a>"
    else
      cell='<span class="fail">failed</span>'
      demo='<span style="color:#94a3b8">—</span>'
    fi

    echo "<tr><td>v${v}</td><td>${cell}</td><td><code>${angular}</code></td><td><code>${node}</code></td><td>${demo}</td><td><a href=\"/v${v}/build.log\">build.log</a></td></tr>"
  done

  cat <<HTML
</tbody>
</table>
<p class="peers">Tested package: <code>ngx-colors@${LIB}</code> &middot; declared peer range: <code>${PEERS}</code></p>
</main>
</body>
</html>
HTML
} >"${OUT}"

echo "wrote ${OUT}"
