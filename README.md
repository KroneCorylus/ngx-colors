![size](https://img.shields.io/bundlephobia/min/ngx-colors?style=for-the-badge)
![download](https://img.shields.io/npm/dm/ngx-colors?style=for-the-badge)

<p align="center">
  <h1 align="center">ngx-colors</h1>
  <p align="center">ngx-colors is a colorpicker component for Angular with a material design style. It allows users to select a color via text input (hexadecimal, rgba, hsla, hsva, cmyk), by choosing a preset color from the palette, or with hue, saturation/brightness and alpha sliders.
  </p>
</p>

## Demo and documentation

https://ngx-colors.web.app/

## Preview

![example gif](https://raw.githubusercontent.com/KroneCorylus/ngx-colors/master/projects/ngx-color-examples/src/assets/img/example-gif.gif)

## Migrating from v3?

Most v3 code keeps working thanks to a built-in (deprecated) compatibility layer. See
**[MIGRATION.md](./MIGRATION.md)** for the full list of changes, what is deprecated, and how
to migrate each API. The archived v3 documentation lives in
**[V3-DOCUMENTATION.md](./V3-DOCUMENTATION.md)**.

## Installation

#### Compatibility

| Angular    | Latest ngx-colors compatible |
| ---------- | ---------------------------- |
| 17.3 to 22 | 4.x                          |
| 15 to 17   | 3.6.0                        |
| 13, 14     | 3.1.4                        |
| 10 to 12   | 3.0.5                        |

#### Npm

```shell
npm install ngx-colors
```

No extra setup — the picker uses plain CSS animations, so you do **not** need
`provideAnimations()` or `BrowserAnimationsModule`.

##### Import the standalone component and directive:

```ts
import { NgxColorsComponent, NgxColorsTriggerDirective } from 'ngx-colors';

@Component({
  standalone: true,
  imports: [NgxColorsComponent, NgxColorsTriggerDirective],
  ...
})
```

##### Or, for NgModule-based apps:

```ts
import { NgxColorsModule } from 'ngx-colors';

@NgModule({
  ...
  imports: [
    ...
    NgxColorsModule
  ]
})
```

## Overview and usage

This library is composed of two parts:

1. `ngxColorsTrigger`: This directive can be applied to any html element, turning it into a
   trigger that opens the color picker when clicked.
2. `ngx-colors`: This component is a premade button that displays the selected color.

##### Use it in your HTML template with ngModel:

```html
<ngx-colors ngxColorsTrigger [(ngModel)]="color"></ngx-colors>
```

##### With Reactive Forms:

```html
<ngx-colors ngxColorsTrigger [formControl]="colorFormControl"></ngx-colors>
```

##### Or without any Forms module, using two-way binding:

```html
<ngx-colors ngxColorsTrigger [(color)]="color"></ngx-colors>
```

##### Custom trigger:

Any element can be a trigger:

```html
<div ngxColorsTrigger [(ngModel)]="color" [style.background]="color"></div>
```

##### Fix the output format:

```html
<ngx-colors ngxColorsTrigger [(ngModel)]="color" outputModel="HEXA"></ngx-colors>
```

By default (`outputModel="AUTO"`) the output keeps the format the value was set in.

##### Limit the formats available in the text input:

```html
<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [allowedModels]="['HEXA', 'CMYK']"
></ngx-colors>
```

## API

### Inputs

| Input                  | Type                                          | Default                            | Description                                                                                                          |
| ---------------------- | --------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `color`                | `string`                                      | `undefined`                        | Two-way bindable color value (`[(color)]`), for use without Forms                                                     |
| `disabled`             | `boolean`                                     | `false`                            | Disables the trigger (also settable via `FormControl.disable()`)                                                      |
| `palette`              | `ColorOption[] \| Observable<ColorOption[]>`  | Material palette                   | Colors shown in the palette; groups can nest via `childs` and show tooltips via `name`; Observables show a skeleton   |
| `animation`            | `'popup' \| 'slide'`                          | `'popup'`                          | Animation of the palette swatches                                                                                     |
| `outputModel`          | `'HEXA' \| 'RGBA' \| 'HSLA' \| 'HSVA' \| 'CMYK' \| 'AUTO'` | `'AUTO'`              | Format of the emitted value; `AUTO` keeps the format of the last input                                                |
| `allowedModels`        | `ColorModel[]`                                | all five                           | Formats the text input can cycle through                                                                              |
| `display`              | `{ text?, sliders?, palette? }`               | all `true`                         | Shows/hides each section of the panel                                                                                 |
| `layout`               | `'pages' \| 'full-vertical' \| 'full-horizontal'` | `'pages'`                      | Panel layout: paged (palette ⇄ sliders) or everything at once                                                          |
| `lockValues`           | `{ hue?, saturation?, brightness?, alpha?, clamp? }` | none locked                 | Locks a channel to a fixed value (hue 0–360, rest 0–1) and hides its slider. `clamp: true` also forces incoming/picked colors onto the locked channels (default `false`, which keeps the color's own value for locked channels) |
| `confirmationRequired` | `{ palette?, text?, sliders? }`               | `{ sliders: true }`                | Which input types need explicit ACCEPT before committing                                                               |
| `eyedropper`           | `boolean`                                     | `false`                            | Shows an eyedropper button (browsers with `EyeDropper` support)                                                        |
| `labels`               | `{ accept?, cancel? }`                        | `ACCEPT` / `CANCEL`                | Button labels (also settable globally via `NGX_COLORS_LABELS`)                                                         |
| `overlayClass`         | `string`                                      | `undefined`                        | Extra class added to the overlay element                                                                               |
| `overlayAttachTo`      | `string \| HTMLElement`                       | `document.body`                    | Element (or element id) the overlay is appended to                                                                     |
| `position`             | `'top' \| 'bottom'`                           | auto                               | Forces the panel above/below the trigger instead of auto-flipping                                                      |
| `closeOnHidden`        | `boolean`                                     | `false`                            | Closes the panel when the trigger becomes hidden/scrolled out of view (via `IntersectionObserver`). Pair with `overlayAttachTo` the dialog element to use the picker inside a native `<dialog>` |
| `theme`                | `'light' \| 'dark' \| 'auto'`                 | `'light'`                          | Panel color theme. `auto` follows `prefers-color-scheme`. For finer control, override the CSS custom properties below |

### Outputs

| Output        | Payload          | Description                                                                              |
| ------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| `colorChange` | `string \| null` | Emits whenever the value changes (enables `[(color)]`)                                    |
| `userChange`  | `string \| null` | Emits only for user-driven changes (palette click, text edit, confirmed slider change)    |
| `sliderChange`| `SliderChange \| null` | Emits continuously while the user drags a slider (and on an eyedropper pick). `SliderChange` is `{ value: string; hsla: Hsla }` — `value` is formatted per `outputModel` |
| `colorHover`  | `Rgba \| null`   | Emits when the user hovers a palette swatch                                               |
| `open`        | `string \| null` | Emits when the panel opens, with the current color                                        |
| `close`       | `string \| null` | Emits when the panel closes, with the current color                                       |

### Methods

Grab the directive with `@ViewChild(NgxColorsTriggerDirective)` to control the panel
programmatically:

| Member         | Signature       | Description                                                        |
| -------------- | --------------- | ------------------------------------------------------------------ |
| `openPanel()`  | `(): void`      | Opens the panel. No-op if disabled or already open                 |
| `closePanel()` | `(): void`      | Closes the panel (keeps the committed value). No-op if not open    |
| `isOpen`       | `boolean` (get) | Whether the panel is currently open                                |

### Global configuration

Every input (except `color`/`disabled`) can be provided once for the whole app; individual
bindings override it:

```ts
import { NGX_COLORS_CONFIG } from 'ngx-colors';

providers: [
  {
    provide: NGX_COLORS_CONFIG,
    useValue: {
      layout: 'full-vertical',
      eyedropper: true,
      labels: { accept: 'OK', cancel: 'Cancel' },
      palette: ['#FF5E5B', '#68C5DB', '#FFED8A'],
    },
  },
];
```

### Custom palette

```ts
import { ColorOption } from 'ngx-colors';

palette: ColorOption[] = [
  '#FF5E5B',
  { color: '#68C5DB', name: 'Lagoon' },
  {
    color: '#E57373',
    name: 'Reds',
    childs: ['#FFEBEE', '#EF9A9A', '#E57373', '#E53935', '#C62828'],
  },
];
```

`childs` can nest arbitrarily deep; `name` shows as a tooltip. An
`Observable<ColorOption[]>` works too and shows a loading skeleton until it emits.

### Form validation

```ts
import { colorValidator } from 'ngx-colors';

colorFormControl = new FormControl('#ff0000', [colorValidator()]);
```

Returns `{ invalidColor: true }` for strings that are not a valid color (unknown format or
out-of-range channels). Empty values pass — combine with `Validators.required` as needed.

## Theming

The picker ships a built-in `light` (default) and `dark` theme, selectable with the `theme`
input (or globally via `NGX_COLORS_CONFIG`):

```html
<ngx-colors ngxColorsTrigger [(ngModel)]="color" theme="dark"></ngx-colors>
```

`theme="auto"` follows the OS `prefers-color-scheme`.

For any other look, override the CSS custom properties. They cascade to the panel from
anywhere above it (e.g. `:root`), so you can theme all pickers globally or scope it:

```css
:root {
  --ngx-colors-surface: #1b1e2b;
  --ngx-colors-text: #c8ccd8;
  --ngx-colors-border: #2c3040;
  --ngx-colors-radius: 10px;
}
```

| Token | What it colors | Light default |
| --- | --- | --- |
| `--ngx-colors-surface` | panel background | `#ffffff` |
| `--ngx-colors-text` | text, inputs, icons | `#595b65` |
| `--ngx-colors-text-strong` | accept/cancel buttons | `#222222` |
| `--ngx-colors-border` | input/field borders | `#f3f3f3` |
| `--ngx-colors-hover` | hover wash | `rgba(0,0,0,0.05)` |
| `--ngx-colors-error` | invalid text input | `#f44336` |
| `--ngx-colors-tooltip-bg` / `--ngx-colors-tooltip-text` | palette tooltips | `#2f3033` / `#f2f0f4` |
| `--ngx-colors-skeleton` | async-palette loading | `#efefef` |
| `--ngx-colors-selected-ring` | selected swatch ring | `rgba(255,255,255,0.6)` |
| `--ngx-colors-checkerboard` / `--ngx-colors-checkerboard-alt` | alpha transparency grid | `#cccccc` / `#ffffff` |
| `--ngx-colors-elevation` | panel shadow | (material elevation) |
| `--ngx-colors-radius` | corner radius | `4px` |
| `--ngx-colors-swatch-ring` | `<ngx-colors>` button ring | `#ffffff` |

## RTL

RTL is supported automatically: the panel position, layout and directional icons follow the
trigger's computed `direction`, with no configuration needed.
