# Angular compatibility harness

Builds a fresh Angular 22 app, installs the locally packed `ngx-colors`, and
serves it from nginx so the picker can be tested as a real package consumer.
Version 5 requires Angular 22; earlier majors are covered by the v4 release.

## Run it

Use the repository's Node version (`nvm use`) and install dependencies with
`npm ci`, then run:

```sh
npm run compat
```

Docker must be running. Open <http://localhost:8080> for the build result,
live demo, dependency tree, and build log. Stop the server with
`docker rm -f ngx-colors-compat`.

| Flag | Meaning |
| --- | --- |
| `--peers keep` | Test the package's declared peer range (the default). |
| `--peers "<range>"` | Override the packed peer range for an experiment. |
| `--port <n>` | Host port (default `8080`). |
| `--no-cache` | Rebuild without Docker layer caching. |
| `--no-serve` | Build and print the results without starting the server. |

## What it tests

The harness scaffolds an application with Angular 22's own CLI, preserving its
bootstrap, change detection defaults, and builder. It installs the tarball
with strict peer resolution, then builds it in production mode to check its
public types, templates, and partial compilation output.

A successful build is not a browser interaction test. Use the served demo to
check selecting colors, forms, and overlays. Failed builds retain their logs
and are displayed in the results page.

The Dockerfile uses Node 24.18.0. To add a supported Angular major, add a build
stage invoking `scripts/build-one.sh <major>` and copy its `/out/` into the
final nginx stage. Update the library's peer dependencies after verification.
