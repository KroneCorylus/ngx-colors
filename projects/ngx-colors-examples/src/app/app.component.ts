import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ColorHelper,
  NGX_COLORS_CONFIG,
  NGX_COLORS_LABELS,
  NgxColorsComponent,
  NgxColorsConfiguration,
  NgxColorsTriggerDirective,
  PaletteComponent,
} from '../../../ngx-colors/src/public-api';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rgba } from '../../../ngx-colors/src/lib/models/rgba';
import { Observable, delay, map, of } from 'rxjs';
import { defaultColors } from '../../../ngx-colors/src/lib/utility/default-colors';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ColorOption } from '../../../ngx-colors/src/public-api';
import {
  transition,
  trigger,
  stagger,
  animate,
  style,
  query,
  keyframes,
} from '@angular/animations';

export type ColorsApiColorType = {
  hex: {
    value: string;
  };
  name: {
    value: string;
  };
};
export type ColorsApiResponseType = {
  colors: Array<ColorsApiColorType>;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxColorsComponent,
    ReactiveFormsModule,
    PaletteComponent,
    NgxColorsTriggerDirective,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: NGX_COLORS_CONFIG,
      useValue: {
        eyedropper: true,
        display: {
          text: true,
          sliders: true,
          palette: true,
        },
        layout: 'full-vertical',
        lockValues: {
          alpha: 1,
        },
        overlayClass: '_default-overlay',
        labels: { accept: 'OK', cancel: 'NAH' },
      },
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('logIn', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ background: 'red' }),
            stagger(100, [animate('1s ease-out', style({}))]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  constructor(public http: HttpClient) {}
  title = 'ngx-colors-examples';

  test: string | undefined | null = 'rgba(255,0,255,0.5)';

  testCtrl: FormControl<string | undefined | null> = new FormControl<
    string | undefined | null
  >('rgba(0,255,100,0.9)');

  events: Array<{
    who: string;
    event: string;
    value: string | null | undefined;
  }> = [];

  html = document.documentElement;

  displayOptions = {
    text: true,
    sliders: true,
    palette: true,
  };

  public onClickChangeDisplay() {
    if (this.displayOptions.palette) {
      this.displayOptions = {
        text: true,
        sliders: true,
        palette: false,
      };
    } else {
      this.displayOptions = {
        text: true,
        sliders: true,
        palette: true,
      };
    }
  }
  ngOnInit(): void {
    this.setRequest('3A02A9');
  }
  public request: Observable<Array<ColorOption>> | undefined = undefined;

  public setRequest(hex: string) {
    this.request = this.http
      .get<ColorsApiResponseType>(
        `https://www.thecolorapi.com/scheme?hex=${hex}&mode=analogic&count=19`,
      )
      .pipe(
        map((r: ColorsApiResponseType) => {
          return r.colors.map((c: ColorsApiColorType) => {
            return { color: c.hex.value, name: c.name.value };
          });
        }),
      );
  }

  public onModelChanges(value: string | undefined, who: string) {
    console.log('onModelChange', value);
    if (who == 'control' && value) {
      let rgba = ColorHelper.stringToRgba(value);
      let hex = ColorHelper.rgba2Hex(rgba).replace('#', '');
      this.setRequest(hex);
    }
    this.events.push({ who: who, event: 'ngModelChange', value: value });
  }

  public logEvent(who: string, event: string, value: any) {
    this.events.push({ who, event, value: value?.toString() ?? 'undefined' });
  }
  public clearLog() {
    this.events.length = 0;
  }

  public setBlue() {
    this.testCtrl.setValue('rgba(0,0,255,1)');
    this.test = 'rgba(0,0,255,1)';
  }
  public setRed() {
    this.testCtrl.setValue('rgb(255, 0, 0)');
    this.test = 'rgba(255,0,0,1)';
  }
  public setAlphaRed() {
    // this.testCtrl.setValue('rgba(255, 0, 0, 0.5)');
    this.test = 'rgba(255, 0, 0, 0.5)';
  }
  public setUndefined() {
    this.testCtrl.setValue(undefined);
    this.test = undefined;
  }
}
