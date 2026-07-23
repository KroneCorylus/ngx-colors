import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgxColorsComponent,
  NgxColorsTriggerDirective,
} from '../../../../../ngx-colors/src/public-api';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

type TokenRow = {
  name: string;
  appliesTo: string;
  light: string;
  dark: string;
};

@Component({
  selector: 'app-theming-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    CodeBlockComponent,
  ],
  templateUrl: './theming.component.html',
  styleUrl: './theming.component.scss',
})
export class ThemingPageComponent {
  readonly sections = [
    { id: 'how-it-works', label: 'How it works' },
    { id: 'built-in', label: 'Built-in themes' },
    { id: 'tokens', label: 'Token reference' },
    { id: 'scoping', label: 'Global vs per-picker' },
    { id: 'custom', label: 'Custom theme' },
  ];

  lightColor: string | null = '#4dd0e1';
  darkColor: string | null = '#4dd0e1';
  autoColor: string | null = '#7ae582';
  brandColor: string | null = '#b388ff';

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  readonly tokens: TokenRow[] = [
    {
      name: '--ngx-colors-surface',
      appliesTo: 'Panel background',
      light: '#ffffff',
      dark: '#26272b',
    },
    {
      name: '--ngx-colors-text',
      appliesTo: 'Primary text, inputs, and icons (via currentColor)',
      light: '#595b65',
      dark: '#c8cbd3',
    },
    {
      name: '--ngx-colors-text-strong',
      appliesTo: 'Accept / cancel button text',
      light: '#222222',
      dark: '#e8eaf0',
    },
    {
      name: '--ngx-colors-border',
      appliesTo: 'Input and field borders',
      light: '#f3f3f3',
      dark: '#3a3b40',
    },
    {
      name: '--ngx-colors-hover',
      appliesTo: 'Hover wash on buttons and icons',
      light: 'rgba(0, 0, 0, 0.05)',
      dark: 'rgba(255, 255, 255, 0.08)',
    },
    {
      name: '--ngx-colors-error',
      appliesTo: 'Invalid text-input state',
      light: '#f44336',
      dark: '#ff6b5e',
    },
    {
      name: '--ngx-colors-selected-ring',
      appliesTo: 'Ring around the selected swatch',
      light: 'rgba(255, 255, 255, 0.6)',
      dark: 'rgba(255, 255, 255, 0.7)',
    },
    {
      name: '--ngx-colors-tooltip-bg',
      appliesTo: 'Palette-swatch tooltip background',
      light: '#2f3033',
      dark: '#0c0d10',
    },
    {
      name: '--ngx-colors-tooltip-text',
      appliesTo: 'Palette-swatch tooltip text',
      light: '#f2f0f4',
      dark: '#e8eaf0',
    },
    {
      name: '--ngx-colors-thumb-border',
      appliesTo: 'Slider / picker thumb outline',
      light: '#000000',
      dark: '#000000',
    },
    {
      name: '--ngx-colors-thumb-ring',
      appliesTo: 'Slider / picker thumb inner ring',
      light: '#ffffff',
      dark: '#ffffff',
    },
    {
      name: '--ngx-colors-checkerboard',
      appliesTo: 'Alpha-transparency grid (dark cells)',
      light: '#cccccc',
      dark: '#55565c',
    },
    {
      name: '--ngx-colors-checkerboard-alt',
      appliesTo: 'Alpha-transparency grid (light cells)',
      light: '#ffffff',
      dark: '#3a3b40',
    },
    {
      name: '--ngx-colors-skeleton',
      appliesTo: 'Async-palette loading placeholder',
      light: '#efefef',
      dark: '#34353a',
    },
    {
      name: '--ngx-colors-swatch-ring',
      appliesTo: 'Ring on the <ngx-colors> preview button',
      light: '#ffffff',
      dark: '#26272b',
    },
    {
      name: '--ngx-colors-radius',
      appliesTo: 'Corner radius of the panel and inputs (length, not a color)',
      light: '4px',
      dark: '4px',
    },
    {
      name: '--ngx-colors-elevation',
      appliesTo: 'Panel drop shadow (full box-shadow value, not a color)',
      light: '0 1px 1px #0003, 0 1px 1px 1px #00000024, …',
      dark: '0 2px 6px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)',
    },
  ];

  readonly snippetThemeInput = `<!-- light (default), dark, or auto (follows the OS) -->
<ngx-colors ngxColorsTrigger [(ngModel)]="color" theme="dark"></ngx-colors>
<ngx-colors ngxColorsTrigger [(ngModel)]="color" theme="auto"></ngx-colors>`;

  readonly snippetGlobalTheme = `import { NGX_COLORS_CONFIG } from 'ngx-colors';

providers: [
  { provide: NGX_COLORS_CONFIG, useValue: { theme: 'dark' } },
]`;

  readonly snippetGlobalTokens = `/* styles.css — applies to every picker in the app */
:root {
  --ngx-colors-surface: #1b1b1f;
  --ngx-colors-text: #d7d9e0;
  --ngx-colors-radius: 12px;
}`;

  readonly snippetScopedTokens = `/* global stylesheet — NOT a component style.
   The overlay is appended to <body>, so a wrapper
   class around the trigger would never reach it. */
.brand-theme {
  --ngx-colors-surface: #2a1a3e;
  --ngx-colors-text: #e0d4f5;
  --ngx-colors-text-strong: #ffffff;
  --ngx-colors-border: #4a3a5e;
  --ngx-colors-radius: 14px;
  --ngx-colors-selected-ring: #d6a8ff;
  --ngx-colors-elevation: 0 8px 30px rgba(120, 40, 200, 0.45);
}`;

  readonly snippetScopedUsage = `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [overlayClass]="'brand-theme'"
></ngx-colors>`;
}
