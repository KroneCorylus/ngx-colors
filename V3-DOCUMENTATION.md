# ngx-colors 3.x — documentation (archived)

> This is the archived documentation for **ngx-colors 3.x** (last release: 3.6.0), preserving
> the content of the old documentation site. The 3.x API still works in 4.x through a
> deprecated compatibility layer — see [MIGRATION.md](./MIGRATION.md) for the v3 → v4
> migration guide, and the README for the current documentation.

ngx-colors is a colorpicker component for Angular with a material design style. It allows
users to select a color via text input (hexadecimal, rgba, hsla), by choosing a preset color
from the palette, or with a color picker using the Hue, Lightness and Alpha sliders.

This library is composed of two parts:

1. **`ngx-colors-trigger`**: a directive that can be applied to any HTML element, turning it
   into a trigger that opens the color picker when clicked.
2. **`ngx-colors`**: a premade button that displays the selected color.

## Installation

#### Compatibility

| Angular  | Latest ngx-colors compatible |
| -------- | ---------------------------- |
| 15 to 17 | 3.6.0                        |
| 13, 14   | 3.1.4                        |
| 10 to 12 | 3.0.5                        |

#### Npm

The picker uses Angular animations:

```shell
npm install @angular/animations
```

```shell
npm install ngx-colors
```

#### Load the module in your app module

```typescript
import { NgxColorsModule } from 'ngx-colors';

@NgModule({
  ...
  imports: [
    ...
    NgxColorsModule
  ]
})
```

## Usage

#### With ngModel

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color"></ngx-colors>
```

#### With Reactive Forms

```html
<form class="example-form">
  <ngx-colors
    ngx-colors-trigger
    style="display: inline-block; margin:5px;"
    [formControl]="colorFormControl"
  ></ngx-colors>
</form>
Value: {{ colorFormControl.value }}
```

#### Selecting one output format

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color" [format]="'hex'"></ngx-colors>
```

#### Limiting the available formats

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color" [formats]="['hex', 'cmyk']"></ngx-colors>
```

## API

### Inputs (`ngx-colors-trigger`)

| Input                 | Type                                  | Default      | Description                                                                                      |
| --------------------- | ------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| `palette`             | `Array<string> \| Array<NgxColorsColor>` | material palette | Set a custom palette for the color picker. Accepts an array of color strings or `NgxColorsColor` |
| `colorsAnimation`     | `'slide-in' \| 'popup'`               | `'slide-in'` | Set the animation for the color circles                                                           |
| `format`              | `string`                              | —            | Set the output format (`hex`, `rgba`, `hsla`, `cmyk`). Also disables format cycling in the text input |
| `formats`             | `string[]`                            | all          | Set which formats the text input can cycle through                                                |
| `position`            | `'top' \| 'bottom'`                   | `'bottom'`   | Position of the panel relative to the trigger                                                     |
| `hideTextInput`       | `boolean`                             | `false`      | Hide the text input                                                                               |
| `hideColorPicker`     | `boolean`                             | `false`      | Hide the option to open the sliders to choose a color                                             |
| `colorPickerControls` | `'default' \| 'only-alpha' \| 'no-alpha'` | `'default'` | Set the controls shown in the color picker                                                        |
| `acceptLabel`         | `string`                              | `'ACCEPT'`   | Set the label of the accept button                                                                |
| `cancelLabel`         | `string`                              | `'CANCEL'`   | Set the label of the cancel button                                                                |
| `overlayClassName`    | `string`                              | —            | Set a class on the overlay element                                                                |
| `attachTo`            | `string`                              | `body`       | Set the element (by id) the overlay is appended to                                                |

### Outputs (`ngx-colors-trigger`)

| Output   | Payload  | Description                                                        |
| -------- | -------- | ------------------------------------------------------------------ |
| `change` | `string` | Triggered every time the selected color changes                    |
| `input`  | `string` | Triggered when the color is changed by the user using the panel    |
| `slider` | `string` | Triggered while the alpha, hue or lightness sliders are moved      |
| `open`   | `string` | Triggered when the panel is opened                                 |
| `close`  | `string` | Triggered when the panel is closed                                 |

### Custom palette shape

```typescript
import { NgxColorsColor } from 'ngx-colors';
```

A palette entry is either a color string or an `NgxColorsColor` with a preview color and a
list of variants shown on a second page:

```typescript
{
  preview: '#9c27b0e0',
  variants: ['#9c27b0', '#9c27b0de', '#9c27b0bd', '#9c27b09c', '#9c27b075', '#9c27b047'],
}
```

### Validator

```typescript
import { validColorValidator } from 'ngx-colors';
```

A `ValidatorFn` for form controls that returns `{ invalidColor: true }` when the value is not
a valid hex, rgb(a) or hsl(a) color.

## Examples

> The example markup below is taken verbatim from the old documentation site; some snippets
> use Angular Material components (`mat-icon`, `mat-slide-toggle`, `mat-form-field`, …) for
> the surrounding controls — they are not required by ngx-colors.

### Custom trigger

Any element can act as the trigger:

```html
<div
  class="example-palette-button"
  ngx-colors-trigger
  [(ngModel)]="input1"
  [style.color]="input1"
>
  <mat-icon aria-hidden="false" aria-label="Example home icon" fontIcon="palette"> </mat-icon>
</div>
```

### Hide elements

```html
<ngx-colors
  ngx-colors-trigger
  [hideTextInput]="hideTextInput"
  [hideColorPicker]="hideColorPicker"
  [colorPickerControls]="colorPickerControls"
  [(ngModel)]="color"
>
</ngx-colors>
```

`colorPickerControls` accepts `default`, `only-alpha` and `no-alpha`.

### Custom palette

```typescript
import { NgxColorsColor } from 'ngx-colors';

selectedColor: string = '#9C27B0';
colorToAdd: string = '#EC407A';
colorPalette: Array<any> = [
  {
    preview: '#9c27b0e0',
    variants: [
      '#9c27b0',
      '#9c27b0de',
      '#9c27b0bd',
      '#9c27b09c',
      '#9c27b075',
      '#9c27b047',
    ],
  },
  '#00BCD4',
  '#03A9F4',
  '#B2F35C',
];

public addToPalette() {
  this.colorPalette.push(this.colorToAdd);
}
```

```html
<ngx-colors
  ngx-colors-trigger
  [palette]="colorPalette"
  [(ngModel)]="selectedColor"
  [hideColorPicker]="true"
  [hideTextInput]="true"
>
</ngx-colors>

<ngx-colors ngx-colors-trigger [(ngModel)]="colorToAdd"></ngx-colors>
<button (click)="addToPalette()">Add to palette</button>
```

### Change accept and cancel labels

```html
<ngx-colors
  ngx-colors-trigger
  [(ngModel)]="color"
  acceptLabel="Select"
  cancelLabel="Cancel"
>
</ngx-colors>
```

### Detect changes

```typescript
color = '#0070f3';
colorIndex = 0;
colors = ['#0070f3', '#00796B', '#D81B60', '#7986CB'];

logs: Array<Array<any>> = [];

public rotateColor(): void {
  this.colorIndex = (this.colorIndex + 1) % this.colors.length;
  this.color = this.colors[this.colorIndex];
}

public logEvent(event, trigger) {
  this.logs.unshift([this.logs.length + 1, trigger, event]);
}
```

```html
<ngx-colors
  ngx-colors-trigger
  [(ngModel)]="color"
  (ngModelChange)="logEvent($event, 'ngModelChange')"
  (change)="logEvent($event, 'change')"
  (input)="logEvent($event, 'input')"
  (slider)="logEvent($event, 'slider')"
>
</ngx-colors>

<button (click)="rotateColor()">Change color externally</button>
```

### Validator

```typescript
import { FormControl, FormGroup } from '@angular/forms';
import { validColorValidator } from 'ngx-colors';

public exampleForm: FormGroup = new FormGroup(
  {
    inputCtrl: new FormControl('rgb(79, 195, 255)', validColorValidator()),
    pickerCtrl: new FormControl('rgb(79, 195, 255)'),
  },
  { updateOn: 'change' },
);

ngOnInit(): void {
  this.exampleForm.controls['inputCtrl'].valueChanges.subscribe((color) => {
    if (this.exampleForm.controls['pickerCtrl'].valid) {
      this.exampleForm.controls['pickerCtrl'].setValue(color, {
        emitEvent: false,
      });
    }
  });
  this.exampleForm.controls['pickerCtrl'].valueChanges.subscribe((color) =>
    this.exampleForm.controls['inputCtrl'].setValue(color, {
      emitEvent: false,
    }),
  );
}
```

```html
<form class="example-form2" [formGroup]="exampleForm">
  <mat-form-field class="example-full-width">
    <mat-label>Color</mat-label>
    <input matInput formControlName="inputCtrl" />
    <ngx-colors
      class="suffix"
      matSuffix
      ngx-colors-trigger
      formControlName="pickerCtrl"
    ></ngx-colors>
    <mat-error *ngIf="this.exampleForm.controls['inputCtrl'].hasError('invalidColor')">
      The color is invalid.
    </mat-error>
  </mat-form-field>
</form>
```
