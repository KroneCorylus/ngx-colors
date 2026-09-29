# Migrating to ngx-colors v5

Version 5 requires **Angular 22** and RxJS 7.4 or newer. Applications on Angular
17–21 should stay on `ngx-colors@4` until they upgrade Angular.

The deprecated v3 compatibility layer is removed. This affects v4 applications
that still use the old API as well as applications upgrading directly from v3.
There is no automatic translation or fallback to the old API in v5.

## Replace the removed API

| Removed API | Replacement | Migration details |
| --- | --- | --- |
| `ngx-colors-trigger` | `ngxColorsTrigger` | The old selector is recognized only to throw a migration error. |
| `colorsAnimation="slide-in"` | `animation="slide"` | `popup` remains available. |
| `[format]="'hex'"` | `outputModel="HEXA"` **and** `[allowedModels]="['HEXA']"` | The old option controlled both output and editor formats. Use uppercase model names: `HEXA`, `RGBA`, `HSLA`, `HSVA`, `CMYK`. |
| `[formats]="['hex','cmyk']"` | `[allowedModels]="['HEXA','CMYK']"` | The array must be non-empty. |
| `[hideTextInput]="true"` | `[display]="{ text: false }"` | Invert the old boolean. |
| `[hideColorPicker]="true"` | `[display]="{ sliders: false }"` | Invert the old boolean. |
| `attachTo="element-id"` | `overlayAttachTo="element-id"` | Also accepts an `HTMLElement` through property binding. |
| `overlayClassName="cls"` | `overlayClass="cls"` | |
| `acceptLabel` / `cancelLabel` | `[labels]="{ accept: 'OK', cancel: 'Cancel' }"` | Also available through global configuration. |
| `colorPickerControls="no-alpha"` | `[lockValues]="{ alpha: 1 }"` | Omit the old `default` option. For `only-alpha`, lock hue, saturation, and brightness and choose a suitable `layout`; the old palette-repainting behavior is not supported. |
| `(change)` | `(colorChange)` | Receives the formatted committed value. |
| `(input)` | `(userChange)` | Receives committed user selections, excluding external writes. |
| `(slider)` | `(sliderChange)` | Payload is `{ value: string; hsla: Hsla }` or `null`. Use `$event?.value` if the handler needs the old formatted string. |
| `NgxColorsColor` / `{ preview, variants }` | `ColorOption` / `{ color, childs?, name? }` | Rename `preview` to `color`, `variants` to `childs`, and the old `color` label to `name`. |
| `validColorValidator()` | `colorValidator()` | Same validation behavior and `{ invalidColor: true }` error key. |
| `LegacyTriggerInputs`, `legacyInputsToConfiguration`, `translateLegacyPalette` | Modern configuration and palette types | These compatibility helpers are no longer exported. |

For example, replace:

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color" format="hex"
  (input)="onPick($event)"></ngx-colors>
```

with:

```html
<ngx-colors ngxColorsTrigger [(ngModel)]="color"
  outputModel="HEXA" [allowedModels]="['HEXA']"
  (userChange)="onPick($event)"></ngx-colors>
```

A palette group now looks like this:

```ts
import { ColorOption } from 'ngx-colors';

const palette: ColorOption[] = [
  '#ff0000',
  { color: '#00ff00', name: 'Greens', childs: ['#00ff00', '#008800'] },
  undefined, // A clear-color swatch.
];
```

## Migration errors and their limits

Removed imports fail TypeScript compilation. Removed property bindings normally
fail Angular template checking; schemas that suppress unknown-property errors
can hide these diagnostics.

On an instantiated picker, literal legacy attributes such as `format="hex"`
and the old selector throw runtime errors naming the replacement. Legacy palette
objects throw errors with their location, such as `palette[2].childs[0]`. This
covers direct palettes, global palettes, and observable emissions. Observable
failures are sent to Angular's `ErrorHandler` and clear the loading state.

**Check old event bindings manually.** Angular can accept `(change)`, `(input)`,
and `(slider)` as DOM listeners after library outputs disappear. They no longer
receive picker outputs. The library cannot reliably detect those template
listeners using supported runtime APIs. The runtime checks also cannot detect
attributes on elements where the trigger directive has not been imported.

## Value bindings and events

Use one value owner per picker: `[(color)]`, `[(ngModel)]`, `[formControl]`, or
`formControlName`. Combining a `color` input with Angular Forms now throws an
error. Listening to outputs alongside either binding style is supported.

- `colorChange` emits when an external update changes the serialized value and
  for every committed user selection. Equivalent external writes are deduplicated
  after formatting, including when the input and output use different models.
- `userChange` emits only for committed user selections. Repeated selections of
  the same value still emit both outputs.
- Pending edits awaiting confirmation emit neither committed-value output.
  `sliderChange` continues to report slider previews. Canceling preserves the
  committed value and AUTO format.
- An unbound picker does not emit an initial null value. `open` and `close`
  continue to carry the current committed value.
- Angular Forms' `{ emitEvent: false }` suppresses Forms events, not library
  outputs: that option is not passed to the value accessor.

Forms now mark the picker touched when the panel closes, or when an unopened
trigger loses focus, instead of when the panel opens. `updateOn: 'blur'` flushes
pending changes on closing; `updateOn: 'submit'` waits for form submission.
Destroying the picker does not flush pending edits.

## Output and editor formats

`outputModel` controls emitted strings. `allowedModels` controls the text
editor's selectable formats, and must contain at least one valid model. A fixed
output format need not appear in the editor list.

The editor accepts valid pasted colors in any supported format. A pasted format
outside `allowedModels` is converted to the selected editor format on blur and
does not change AUTO's output format. AUTO follows incoming bound values and
available formats selected or typed by the user. Pending format changes become
committed with the value; canceling restores the committed format.

Replace the `allowedModels` array to update an open editor. Unfinished text is
preserved while the field is focused and reformatted on blur.

## APIs that remain supported

`NgxColorsModule` remains a convenience wrapper around the standalone
`NgxColorsComponent` and `NgxColorsTriggerDirective`. Both import styles work.
`NGX_COLORS_LABELS` also remains supported. Configuration precedence is:
defaults → `NGX_COLORS_LABELS` → `NGX_COLORS_CONFIG` → individual inputs.

Validation and conversion behavior is preserved. `colorValidator()` checks raw
channel ranges and rejects invalid colors. Conversion helpers normalize/clamp
colors where specified; validation does not validate an already-clamped value.
Empty values pass the color validator; add `Validators.required` when needed.

## Additional changes for applications coming directly from v3

The v4 rewrite also changed these behaviors, which remain in v5:

- CMYK output uses percentages (`cmyk(25%, 0%, 99%, 13%)`); the parser accepts
  both percent and non-percent CMYK strings. Alpha uses minimal precision.
- CMYK `colorChange` emits CMYK rather than an RGBA preview. Convert with
  `ColorHelper.stringToColorModelString(value, 'RGBA')` if needed.
- HSV/HSVA strings, 4-digit hex, and percent alpha are supported.
- The overlay is an `<ngx-colors-overlay>` element. Old overlay IDs/classes and
  internal styling hooks changed. Use `overlayClass` and the documented CSS
  custom properties. The panel is 220px wide rather than 250px.
- The default animation is `popup`; use `animation="slide"` for sliding swatches.

The [archived v3 documentation](./V3-DOCUMENTATION.md) is historical reference.
Use the [README](./README.md) and demo for current examples.

## Workspace requirements

Development uses Angular CLI 22, TypeScript 6, and Node.js 24.18.0 (`nvm use`).
