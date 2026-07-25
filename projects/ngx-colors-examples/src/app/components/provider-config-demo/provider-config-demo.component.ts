import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NGX_COLORS_CONFIG,
  NgxColorsComponent,
  NgxColorsConfiguration,
  NgxColorsTriggerDirective,
} from '../../../../../ngx-colors/src/public-api';

const SCOPED_CONFIG: NgxColorsConfiguration = {
  layout: 'full-vertical',
  animation: 'slide',
  eyedropper: true,
  labels: { accept: 'OK', cancel: 'Dismiss' },
  palette: ['#FF5E5B', '#FFB74D', '#FFED8A', '#7AE582', '#68C5DB', '#B388FF'],
};

@Component({
  selector: 'app-provider-config-demo',
  standalone: true,
  imports: [FormsModule, NgxColorsComponent, NgxColorsTriggerDirective],
  providers: [{ provide: NGX_COLORS_CONFIG, useValue: SCOPED_CONFIG }],
  template: `
    <div class="gx-swatch-row">
      <ngx-colors ngxColorsTrigger [(ngModel)]="inheritedColor"></ngx-colors>
      <span class="gx-value">{{ inheritedColor }}</span>
      <span class="gx-chip">from the provider</span>
    </div>
    <div class="gx-swatch-row">
      <ngx-colors
        ngxColorsTrigger
        [(ngModel)]="overriddenColor"
        layout="pages"
      ></ngx-colors>
      <span class="gx-value">{{ overriddenColor }}</span>
      <span class="gx-chip">layout="pages" wins</span>
    </div>
  `,
})
export class ProviderConfigDemoComponent {
  inheritedColor: string | null = '#68c5db';
  overriddenColor: string | null = '#b388ff';
}
