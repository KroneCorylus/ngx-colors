<p align="center">
  <h1 align="center">ngx-colors</h1>
  <p align="center">Simple yet elegant Material color picker for Angular</p>
  <p align="center">
  </p>
</p>

## Demo

https://ngx-colors.web.app/

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
