<p align="center">
  <h1 align="center">ngx-colors</h1>
  <p align="center">Simple yet elegant Material color picker for Angular</p>
  <p align="center">Beautiful Angular component for selecting a color from a 
color palette, from Hue, Lightness, Alpha sliders or through text input(hex, rgba, hsla) 

  </p>
</p>

## Demo

https://ngx-colors.web.app/


## Preview

![Low quality gif](https://ngx-colors.web.app/assets/img/example-gif.gif)

## Installation

#### Npm
```shell
npm install @angular/animations
```

#### Npm
```shell
npm install ngx-colors
```

#### Usage


##### Load the module for your app:

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

##### Use it in your HTML template:

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color"></ngx-colors>
```
