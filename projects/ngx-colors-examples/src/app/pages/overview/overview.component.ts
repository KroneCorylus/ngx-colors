import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NgxColorsComponent,
  NgxColorsTriggerDirective,
} from '../../../../../ngx-colors/src/public-api';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    CodeBlockComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewPageComponent {
  heroFrom = '#ff5e5b';
  heroTo = '#4dd0e1';

  readonly bubbles = [
    { color: '#ff5e5b', size: 54, top: '8%', left: '6%', delay: '0s' },
    { color: '#b388ff', size: 34, top: '40%', left: '94%', delay: '0.6s' },
    { color: '#68a6f8', size: 44, top: '64%', left: '3%', delay: '1.2s' },
    { color: '#ffb74d', size: 26, top: '75%', left: '90%', delay: '0.3s' },
    { color: '#7ae582', size: 30, top: '4%', left: '58%', delay: '0.9s' },
  ];

  readonly features: Array<{
    color: string;
    title: string;
    text: string;
    link?: string;
  }> = [
    {
      color: '#ff5e5b',
      title: 'Palettes',
      link: 'custom-palette',
      text: 'Flat color lists or nested groups, with names shown as tooltips. Configurable per picker or globally.',
    },
    {
      color: '#ffb74d',
      title: 'Async palettes',
      link: 'async-palette',
      text: 'The palette input also accepts an Observable<ColorOption[]> — for example, colors loaded from an API. A loading skeleton shows until it emits.',
    },
    {
      color: '#ffed8a',
      title: 'Five color models',
      link: 'output-format',
      text: 'HEX(A), RGBA, HSLA, HSVA and CMYK. With outputModel AUTO the value is emitted in the format it was set in.',
    },
    {
      color: '#7ae582',
      title: 'Forms',
      link: 'reactive',
      text: 'ngModel, Reactive Forms, or [(color)] two-way binding without a Forms module. Includes colorValidator().',
    },
    {
      color: '#4dd0e1',
      title: 'Confirmation',
      link: 'confirmation',
      text: 'Configure per input type — palette, text, sliders — whether changes apply immediately or after ACCEPT.',
    },
    {
      color: '#68a6f8',
      title: 'Locked channels',
      link: 'locked-channels',
      text: 'Lock hue, saturation, brightness or alpha to a fixed value; the corresponding slider is hidden.',
    },
    {
      color: '#b388ff',
      title: 'Eyedropper',
      link: 'eyedropper',
      text: 'Pick a color from the screen in browsers that support the EyeDropper API.',
    },
    {
      color: '#f06292',
      title: 'Accessibility',
      text: 'Dialog semantics, focus trap, Escape to close, keyboard activation and focus restore.',
    },
    {
      color: '#26c6da',
      title: 'RTL',
      text: 'Panel position, layout and directional icons follow the trigger’s computed direction. No configuration.',
    },
    {
      color: '#9ccc65',
      title: 'Positioning',
      text: 'The panel flips above the trigger when there is no room below and clamps to the viewport.',
    },
  ];

  readonly compatibility = [
    { angular: '>= 17.3', version: '4.x' },
    { angular: '15 to 17', version: '3.6.0' },
    { angular: '13, 14', version: '3.1.4' },
    { angular: '10 to 12', version: '3.0.5' },
  ];

  readonly snippetInstall = 'npm install ngx-colors';

  readonly snippetStandalone = [
    "import { NgxColorsComponent, NgxColorsTriggerDirective } from 'ngx-colors';",
    '',
    '@Component({',
    '  standalone: true,',
    '  imports: [NgxColorsComponent, NgxColorsTriggerDirective],',
    '  ...',
    '})',
  ].join('\n');

  readonly snippetModule = [
    "import { NgxColorsModule } from 'ngx-colors';",
    '',
    '@NgModule({',
    '  imports: [NgxColorsModule],',
    '  ...',
    '})',
  ].join('\n');

  readonly snippetUsage =
    '<ngx-colors ngxColorsTrigger [(ngModel)]="color"></ngx-colors>';

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
