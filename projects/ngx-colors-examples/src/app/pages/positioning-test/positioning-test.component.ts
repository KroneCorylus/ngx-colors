import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NGX_COLORS_CONFIG,
  NgxColorsComponent,
  NgxColorsTriggerDirective,
} from '../../../../../ngx-colors/src/public-api';

type PositionKey =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'center';

@Component({
  selector: 'app-positioning-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxColorsComponent,
    NgxColorsTriggerDirective,
  ],
  providers: [
    {
      provide: NGX_COLORS_CONFIG,
      useValue: {
        layout: 'pages',
        display: {
          palette: true,
          sliders: true,
          text: true,
        },
        overlayClass: '_positioning-overlay',
      },
    },
  ],
  templateUrl: './positioning-test.component.html',
  styleUrl: './positioning-test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositioningTestComponent {
  readonly colors: Record<PositionKey, FormControl<string | null>> = {
    topLeft: new FormControl<string | null>('#FF5E5B'),
    topRight: new FormControl<string | null>('#68C5DB'),
    bottomLeft: new FormControl<string | null>('#FFC83D'),
    bottomRight: new FormControl<string | null>('#3E7BFA'),
    center: new FormControl<string | null>('rgba(24, 24, 24, 0.35)'),
  };

  readonly labels: Record<PositionKey, string> = {
    topLeft: 'Top left',
    topRight: 'Top right',
    bottomLeft: 'Bottom left',
    bottomRight: 'Bottom right',
    center: 'Center',
  };

  reset(position: PositionKey) {
    const control = this.colors[position];
    if (!control) return;
    control.reset(null);
  }
}
