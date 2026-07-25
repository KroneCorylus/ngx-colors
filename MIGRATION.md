# Migrating from ngx-colors 3.x to 4.x

v4 is a full rewrite. Most v3 templates keep working as-is thanks to a built-in
**compatibility layer**: the old selector, inputs, outputs, palette shape and validator are
still accepted, marked `@deprecated`, and translated to the new API at runtime.

> **The entire compatibility layer will be removed in the next major version.** Treat every
> item in the "Deprecated but still working" table as a migration TODO, not a permanent API.

The archived v3 documentation (API reference, examples) is preserved in
[V3-DOCUMENTATION.md](./V3-DOCUMENTATION.md).

## Requirements

| | v3 | v4 |
| --- | --- | --- |
| Angular | ≥ 15 | ≥ 17.3 |

## Setup

`NgxColorsModule` still exists and works exactly like in v3 for NgModule-based apps:

```ts
import { NgxColorsModule } from 'ngx-colors';
```

Standalone apps can import the pieces directly (recommended):

```ts
import { NgxColorsComponent, NgxColorsTriggerDirective } from 'ngx-colors';
```

## Deprecated but still working — migrate when convenient

The compat layer translates all of these. When an old and a new option are both set, **the new
API wins**. Precedence (lowest to highest): `NGX_COLORS_LABELS` token → `NGX_COLORS_CONFIG`
token → deprecated v3 inputs → new v4 inputs.

| v3 (deprecated) | v4 replacement | Notes |
| --- | --- | --- |
| `ngx-colors-trigger` (selector) | `ngxColorsTrigger` | both selectors work |
| `colorsAnimation="slide-in"` | `animation="slide"` | `popup` unchanged |
| `[format]="'hex'"` | `outputModel="HEXA"` | values are now uppercase: `HEXA`, `RGBA`, `HSLA`, `HSVA`, `CMYK`. The compat mapping also sets `allowedModels` to that single model, reproducing v3's format lock |
| `[formats]="['hex','cmyk']"` | `[allowedModels]="['HEXA','CMYK']"` | |
| `[hideTextInput]="true"` | `[display]="{ text: false }"` | |
| `[hideColorPicker]="true"` | `[display]="{ sliders: false }"` | `display.palette` can now hide the palette too |
| `attachTo="element-id"` | `[overlayAttachTo]` | now also accepts an `HTMLElement` |
| `overlayClassName="cls"` | `overlayClass="cls"` | |
| `acceptLabel` / `cancelLabel` | `[labels]="{ accept, cancel }"` | or globally via the `NGX_COLORS_LABELS` token |
| `colorPickerControls="no-alpha"` | `[lockValues]="{ alpha: 1 }"` | |
| `(change)` | `(colorChange)` | same payload |
| `(input)` | `(userChange)` | same payload; fires only for user-driven changes |
| `(slider)` | `(sliderChange)` | **payload differs**: the deprecated `(slider)` still emits a formatted `string`; `(sliderChange)` emits `{ value: string; hsla: Hsla }`, where `value` is that same formatted string |
| palette items `{ preview, variants }` (`NgxColorsColor`) | `ColorOption`: `{ color, childs?, name? }` | legacy items are auto-translated (`preview`→`color`, `variants`→`childs`, `color`→`name`); `childs` can nest arbitrarily deep and `name` shows as a tooltip |
| `validColorValidator` | `colorValidator` | alias of the same function; same `{ invalidColor: true }` error key |

## Hard incompatibilities — action required

These are not covered by the compat layer.

1. **`colorPickerControls="only-alpha"` was removed** (by design, including the v3 behavior of
   re-painting the palette swatches while dragging alpha). Equivalent setup: lock the other
   channels so only the alpha slider remains, and choose a layout that shows sliders next to
   the palette:

   ```html
   <ngx-colors ngxColorsTrigger
     [lockValues]="{ hue: 0.5, saturation: 1, brightness: 1 }"
     layout="full-horizontal"
   ></ngx-colors>
   ```

2. **Emitted color strings changed format.**
   - CMYK is now percent-based: `cmyk(25, 0, 99, 13)` → `cmyk(25%, 0%, 99%, 13%)` (the parser
     accepts both).
   - Alpha renders minimally everywhere: `0.50` → `0.5`, `0.0` → `0`.
   - When the bound value is a CMYK string, v3's `(change)` emitted an **rgba preview**
     instead; v4's `(colorChange)` emits the CMYK string itself. Convert with
     `ColorHelper.stringToColorModelString(value, 'RGBA')` if you relied on that.
   - HSVA strings (`hsv(…)`/`hsva(…)`) are new and can appear with `outputModel: 'AUTO'` if
     the user types one.

3. **Overlay DOM and styling hooks changed.** v3 appended
   `<div id="ngx-colors-overlay" class="ngx-colors-overlay">`; v4 renders an
   `<ngx-colors-overlay>` element. CSS targeting the old id/class (or the panel's internal
   markup, which is completely different — the panel is now 220px wide, not 250px) must be
   redone. `overlayClass` still adds your class to the overlay element.

4. **Default animation changed** from `slide-in` to `popup`. Bind
   `colorsAnimation="slide-in"` (deprecated) or `animation="slide"` to keep the old feel.

5. **`colorChange` is quieter than v3's `change`.** Programmatic writes of the same value no
   longer re-emit, and there is no emission on init when nothing is bound. User-driven picks
   emit every time, like v3.

6. **The validator accepts more formats** (hsv/hsva strings, 4-digit hex, percent alpha).
   Forms that treated those as invalid will now accept them. Range validation matches v3:
   out-of-range channels (`rgb(300, …)`, `hsl(400, …)`, alpha > 1) are rejected, and empty
   values pass (pair with `Validators.required` as in v3).

## New in v4 (no v3 equivalent)

Observable palettes (`[palette]="colors$"`) with a loading skeleton, arbitrarily nested
palette groups, swatch tooltips via `name`, `layout` (`pages` / `full-vertical` /
`full-horizontal`), `lockValues`, `eyedropper`, per-input `confirmationRequired`, global
configuration via `NGX_COLORS_CONFIG`, forms-free `[(color)]` two-way binding, `disabled`
input, `(colorHover)`, keyboard/a11y support (focus trap, Escape, dialog semantics),
viewport-aware overlay positioning, and RTL support (automatic — detected from the
trigger's computed `direction`).
