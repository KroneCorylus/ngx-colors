# ngx-colors

Angular color picker with palette, sliders, text input, and form integration.

See the [demo and API documentation](https://ngx-colors.web.app/) and the
[project README](https://github.com/KroneCorylus/ngx-colors#readme) for installation,
configuration, and examples.

## Upgrading to v5

Version 5 requires Angular 22 and removes the deprecated v3 selectors, inputs,
outputs, palette shape, and validator alias. Follow the
[migration guide](https://github.com/KroneCorylus/ngx-colors/blob/master/MIGRATION.md)
for replacements and diagnostic limitations. `NgxColorsModule`, `[(color)]`,
Angular Forms, and the modern events and configuration remain supported.

## Development

This library is built with Angular CLI 22 and TypeScript 6. From the repository
root, run `nvm use`, `npm ci`, and `npm run build:lib`. The package is written to
`dist/ngx-colors` in partial compilation mode.

Run `npm test -- --watch=false --browsers=ChromeHeadless` for the library tests
and `npm run lint` for the workspace lint checks.
