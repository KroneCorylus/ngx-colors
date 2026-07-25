# Angular compatibility harness

Builds a real demo app against every supported Angular major, installs the
locally packed `ngx-colors` into each one, and serves all of them from a single
nginx container so the picker can be clicked through side by side.

## Run it

```bash
./compat/run.sh
```

Then open <http://localhost:8080>. The landing page is a pass/fail matrix; each
row links to that version's live demo and to its full build log.

Stop the server with `docker rm -f ngx-colors-compat`.

### Options

| Flag | Meaning |
| --- | --- |
| `--peers "<range>"` | Peer range stamped into the packed library before testing. Defaults to `^17.3.0 \|\| ^18.0.0 \|\| ... \|\| ^22.0.0`. |
| `--peers keep` | Test the range exactly as declared in `projects/ngx-colors/package.json`. |
| `--port <n>` | Host port (default `8080`). |
| `--no-cache` | Force every Angular version to rebuild from scratch. |
| `--no-serve` | Build and print the matrix, but don't start the server. |

`--peers keep` is the honest reproduction of what a consumer gets from npm
today. The default widened range is what lets versions past the declared
ceiling install at all, so it's the one to use when deciding how far the range
can safely be opened.

## What it actually tests

For each major, `scripts/build-one.sh`:

1. Scaffolds an app with **that major's own CLI** (`npx @angular/cli@N new`), so
   the builder, bootstrap style, and zone/zoneless default are whatever real
   users of that version get — not something this repo pinned.
2. Replaces only the root component with the demo in `app/`, leaving the
   generated bootstrap, providers, and `angular.json` builder alone.
3. Runs `npm install <packed tarball>` with **strict peer resolution** — no
   `--legacy-peer-deps`. An `ERESOLVE` here is a genuine "npm will refuse to
   install this" result, not a warning.
4. Builds with `ng build --configuration production`, which runs AOT template
   type-checking against that major's compiler and links the library's partial
   Ivy declarations with that major's linker.

So a green row means: npm resolves it, the AOT compiler accepts the library's
templates and types, the linker accepts its compiled output, and the bundle
loads and runs in a browser.

A red row is never fatal to the run — the stage records `status=fail`, keeps the
log, and the rest of the matrix still completes.

## Adding a new Angular major

1. Add a stage to the `Dockerfile`:
   ```dockerfile
   FROM base AS v23
   RUN --mount=type=cache,target=/root/.npm,sharing=locked /scripts/build-one.sh 23
   ```
2. Add `COPY --from=v23 /out/ /usr/share/nginx/html/` to the final stage.
3. Widen the default range in `run.sh`.

There are two base stages because Angular's Node floor moves faster than the
matrix does: `base` (`node:22-alpine`) carries v17–v21, and `base-next`
(`node:24-alpine`) carries v22, whose CLI refuses to run on Node < 22.22.3.
Put a new major on `base-next`, and override the images with
`--build-arg NODE_IMAGE=` / `--build-arg NODE_IMAGE_NEXT=` if either floor
moves again.

A `Node.js version ... detected / requires a minimum` line at the top of a
`build.log` is this problem, not a library incompatibility.

## Layout

```
compat/
  Dockerfile          one build stage per Angular major, plus the nginx stage
  nginx.conf          serves /v17 … /v22 and renders build logs as text
  run.sh              build library → pack → docker build → serve
  app/                the demo that gets dropped into every scaffold
  scripts/
    build-one.sh      scaffold + install + build one major
    patch-app.mjs     swap the scaffold's root component for the demo
    make-index.sh     generate the pass/fail landing page
```
