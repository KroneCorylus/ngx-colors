export var snippets = {
  overview: {
    installdeps: {
      leng: "npm",
      code: `npm install @angular/animations`,
    },
    install: {
      leng: "npm",
      code: `npm install ngx-colors`,
    },
    import: {
      leng: "Typescript",
      code: `import { NgxColorsModule } from 'ngx-colors';
  
            @NgModule({
              ...
              imports: [
                ...
                NgxColorsModule
              ]
            })`,
    },
    ngmodel: {
      leng: "HTML",
      code: `<ngx-colors ngx-colors-trigger [(ngModel)]="leftColor"></ngx-colors>
<mat-form-field>
    <input matInput [(ngModel)]="leftColor">
</mat-form-field>`,
    },
    formcontrol: {
      leng: "HTML",
      code: `<form class="example-form">
    <ngx-colors ngx-colors-trigger style="display: inline-block; margin:5px;" [formControl]="colorFormControl"></ngx-colors>
</form>
Value: {{ colorFormControl.value }}`,
    },
    detectchanges: {
      leng: "HTML",
      code: `<ngx-colors ngx-colors-trigger (change)="updateGradient()" [(ngModel)]="ioColor"></ngx-colors>`,
    },
    inputevent: {
      leng: "HTML",
      code: `<ngx-colors ngx-colors-trigger (input)="updateGradient()" [(ngModel)]="ioColor"></ngx-colors>`,
    },
  },
  api: {
    reference: {
      leng: "Typescript",
      code: `import { NgxColorsModule } from 'ngx-colors';`,
    },
    validatorImport: {
      leng: "Typescript",
      code: `import { validColorValidator } from 'ngx-colors';`,
    },
  },
  examples: {
    customtrigger: {
      leng: "HTML",
      code: `<div ngx-colors-trigger [(ngModel)]="ioColor" [style.background]="ioColor" ></div>`,
    },
  },
};
