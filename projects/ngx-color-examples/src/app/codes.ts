export var codes = [
    [
        {
            "leng":"Typescript",
            "code":`import { NgxColorsModule } from 'ngx-colors';
  
            @NgModule({
              ...
              imports: [
                ...
                NgxColorsModule
              ]
            })`
        }
    ],
    [
        {
            "leng":"HTML",
            "code":`<ngx-colors ngx-colors-trigger [(ngModel)]="leftColor"></ngx-colors>
<mat-form-field>
    <input matInput [(ngModel)]="leftColor">
</mat-form-field>`
        }
    ],
    [
        {
            "leng":"HTML",
            "code":`<ngx-colors ngx-colors-trigger (change)="updateGradient()" [(ngModel)]="ioColor"></ngx-colors>`
        }
    ]
]

export var examples = 
[
    [
        {
            "leng":"HTML",
            "code":`<div ngx-colors-trigger [(ngModel)]="ioColor" [style.background]="ioColor" ></div>`
        }
    ]
]