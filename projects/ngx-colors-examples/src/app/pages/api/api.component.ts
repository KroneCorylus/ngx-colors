import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { ApiRow, REMOVED, EXPORTS, INPUTS, METHODS, OUTPUTS } from './api-data';

@Component({
  selector: 'app-api-page',
  imports: [CodeBlockComponent, ScrollSpyDirective],
  templateUrl: './api.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './api.component.scss',
})
export class ApiPageComponent {
  readonly sections = [
    { id: 'inputs', label: 'Inputs' },
    { id: 'outputs', label: 'Outputs' },
    { id: 'methods', label: 'Methods' },
    { id: 'global-configuration', label: 'Global configuration' },
    { id: 'exports', label: 'Exports' },
    { id: 'removed', label: 'Removed v3 API' },
  ];

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  readonly inputs: ApiRow[] = INPUTS;
  readonly outputs: ApiRow[] = OUTPUTS;
  readonly methods: ApiRow[] = METHODS;
  readonly exports: ApiRow[] = EXPORTS;
  readonly removed: ApiRow[] = REMOVED;

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
