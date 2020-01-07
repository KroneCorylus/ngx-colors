<p align="center">
  <h1 align="center">ngx-colors</h1>
  <p align="center">Simple yet elegant Material color picker for Angular</p>
  <p align="center">
    <img src="https://img.shields.io/github/downloads/toinane/colorpicker/total.svg?style=flat-square">
    <img src="https://img.shields.io/github/downloads/toinane/colorpicker/latest/total.svg?style=flat-square">
    <img src="https://img.shields.io/circleci/project/github/Toinane/colorpicker.svg?style=flat-square">
    <img src="https://img.shields.io/github/release/toinane/colorpicker.svg?style=flat-square">
    <img src="https://img.shields.io/github/release-date/Toinane/colorpicker.svg?style=flat-square">
    <img src="https://img.shields.io/david/toinane/colorpicker.svg?style=flat-square">
  </p>
</p>

## Demo


## Installation

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
<ngx-colors [(color)]="color"></ngx-colors>
```
