![size](https://img.shields.io/bundlephobia/min/ngx-colors?style=for-the-badge)
![download](https://img.shields.io/npm/dm/ngx-colors?style=for-the-badge)

<p align="center">
  <h1 align="center">ngx-colors</h1>
  <p align="center">ngx-colors is a colorpicker component of angular with a material design style, allows users to select a color via text input (hexadecimal, rgba, hsla), choosing a preset color from the palette, or a color picker using the Hue, Lightness, and Alpha sliders.
  </p>
</p>

## Demo and documentation

https://ngx-colors.web.app/

## Preview

![example gif](https://raw.githubusercontent.com/KroneCorylus/ngx-colors/master/projects/ngx-color-examples/src/assets/img/example-gif.gif)

## Installation

#### Compatibility

| Angular | Latest ngx-colors compatible |
| ------- | ---------------------------- |
| 15      | Latest                       |
| 14      | 3.1.4                        |
| 13      | 3.1.4                        |
| 12      | 3.0.5                        |
| 11      | 3.0.5                        |
| 10      | 3.0.5                        |

#### Npm

```shell
npm install ngx-colors
```

##### Load the ngx-colors module in your app module:

```javascript
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

1. ngx-colors-trigger: This directive can be applied to any html element turning it into a trigger that when clicked will open the color picker
2. ngx-colors: This component is a premade button that will display the selected color.

##### Use it in your HTML template with ngModel:

```html
<ngx-colors 
  ngx-colors-trigger 
  [(ngModel)]="color"
></ngx-colors>
```

You can select just one format:

```html
<ngx-colors 
  ngx-colors-trigger 
  [(ngModel)]="color"
  [format] = "'hex'"
></ngx-colors>
```

Or you can choise some formats

```html
<ngx-colors 
  ngx-colors-trigger 
  [(ngModel)]="color"
  [formats]="['hex','cmyk']"
></ngx-colors>
```

##### Or with Reactive Forms:

```html
<form class="example-form">
  <ngx-colors
    ngx-colors-trigger
    style="display: inline-block; margin:5px;"
    [formControl]="colorFormControl"
  ></ngx-colors>
</form>
```
