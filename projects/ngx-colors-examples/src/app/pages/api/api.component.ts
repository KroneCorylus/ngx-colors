import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';
import {
  ApiRow,
  DEPRECATED,
  EXPORTS,
  INPUTS,
  METHODS,
  OUTPUTS,
} from './api-data';

@Component({
  selector: 'app-api-page',
  standalone: true,
  imports: [CommonModule, CodeBlockComponent],
  templateUrl: './api.component.html',
  styleUrl: './api.component.scss',
})
export class ApiPageComponent {
  readonly sections = [
    { id: 'inputs', label: 'Inputs' },
    { id: 'outputs', label: 'Outputs' },
    { id: 'methods', label: 'Methods' },
    { id: 'global-configuration', label: 'Global configuration' },
    { id: 'exports', label: 'Exports' },
    { id: 'deprecated', label: 'Deprecated v3 API' },
  ];

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  readonly inputs: ApiRow[] = INPUTS;
  readonly outputs: ApiRow[] = OUTPUTS;
  readonly methods: ApiRow[] = METHODS;
  readonly exports: ApiRow[] = EXPORTS;
  readonly deprecated: ApiRow[] = DEPRECATED;

  readonly snippetGlobalConfig = [
    "import { NGX_COLORS_CONFIG } from 'ngx-colors';",
    '',
    'providers: [',
    '  {',
    '    provide: NGX_COLORS_CONFIG,',
    '    useValue: {',
    "      layout: 'full-vertical',",
    '      eyedropper: true,',
    "      labels: { accept: 'OK', cancel: 'Cancel' },",
    "      palette: ['#FF5E5B', '#68C5DB', '#FFED8A'],",
    '    },',
    '  },',
    '];',
  ].join('\n');
}
