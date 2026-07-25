import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MostUsedColorsService } from '../../services/most-used-colors.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, delay, of } from 'rxjs';
import {
  ColorOption,
  NgxColorsComponent,
  NgxColorsTriggerDirective,
  Rgba,
  colorValidator,
} from '../../../../../ngx-colors/src/public-api';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';
import { SectionHeadingComponent } from '../../components/section-heading/section-heading.component';
import { ProviderConfigDemoComponent } from '../../components/provider-config-demo/provider-config-demo.component';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { SNIPPETS } from './snippets';

type EventEntry = { name: string; value: string };

@Component({
  selector: 'app-examples-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    CodeBlockComponent,
    SectionHeadingComponent,
    ProviderConfigDemoComponent,
    ScrollSpyDirective,
  ],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.scss',
})
export class ExamplesPageComponent {
  constructor(private cd: ChangeDetectorRef) {}

  readonly snippets = SNIPPETS;

  readonly sections = [
    { id: 'basic', label: 'Basic usage' },
    { id: 'custom-trigger', label: 'Custom trigger' },
    { id: 'reactive', label: 'Reactive Forms' },
    { id: 'forms-free', label: 'Without forms' },
    { id: 'custom-palette', label: 'Custom palette' },
    { id: 'async-palette', label: 'Async palette' },
    { id: 'most-used', label: 'Most-used palette' },
    { id: 'output-format', label: 'Output format' },
    { id: 'confirmation', label: 'Confirmation' },
    { id: 'layouts', label: 'Layouts' },
    { id: 'locked-channels', label: 'Locked channels' },
    { id: 'grayscale', label: 'Grayscale' },
    { id: 'palette-only', label: 'Palette only' },
    { id: 'eyedropper', label: 'Eyedropper' },
    { id: 'provider-config', label: 'Global config' },
    { id: 'events', label: 'Events' },
  ];

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  wide(...codes: string[]): boolean {
    return codes.some((code) =>
      code.split('\n').some((line) => line.length > 46),
    );
  }

  basicColor: string | null = '#4dd0e1';
  triggerColor: string | null = '#ff5e5b';
  formsFreeColor: string | null = '#b388ff';
  userPicks = 0;
  paletteColor: string | null = '#68C5DB';
  asyncColor: string | null = null;
  modelColor: string | null = '#7ae582';
  confirmationColor: string | null = '#ffb74d';
  layoutPagesColor: string | null = '#4dd0e1';
  layoutVerticalColor: string | null = '#ff8a65';
  layoutHorizontalColor: string | null = '#9575cd';
  lockedColor: string | null = 'rgba(46, 125, 224, 0.9)';
  grayColor: string | null = '#9e9e9e';
  readonly grayscale: ColorOption[] = [
    '#ffffff',
    '#e0e0e0',
    '#bdbdbd',
    '#9e9e9e',
    '#757575',
    '#616161',
    '#424242',
    '#212121',
    '#000000',
  ];
  paletteOnlyColor: string | null = '#f06292';
  eyedropperColor: string | null = '#ffed8a';
  eventsColor: string | null = '#68a6f8';

  readonly reactiveControl = new FormControl<string | null>('#7ae582', [
    colorValidator(),
  ]);

  readonly customPalette: ColorOption[] = [
    '#FF5E5B',
    { color: '#68C5DB', name: 'Lagoon' },
    { color: '#FFED8A', name: 'Lemon' },
    {
      color: '#B388FF',
      name: 'Purples',
      childs: ['#EDE7F6', '#B39DDB', '#B388FF', '#7E57C2', '#4527A0'],
    },
    {
      color: '#7AE582',
      name: 'Greens',
      childs: ['#E8F5E9', '#A5D6A7', '#7AE582', '#43A047', '#1B5E20'],
    },
  ];

  asyncPalette$: Observable<ColorOption[]> = this.buildAsyncPalette();

  private readonly mostUsed = inject(MostUsedColorsService);
  mostUsedColor: string | null = null;
  readonly mostUsedPalette$ = this.mostUsed.palette('examples-demo');

  onMostUsedPick(color: string | null | undefined): void {
    this.mostUsed.registerUse('examples-demo', color);
  }

  events: EventEntry[] = [];

  onUserPick(): void {
    this.userPicks++;
  }

  reloadAsyncPalette(): void {
    this.asyncPalette$ = this.buildAsyncPalette();
  }

  log(name: string, value?: string | Rgba | null): void {
    const printed =
      value === undefined || value === null ? '' : value.toString();
    this.events.unshift({ name, value: printed });
    if (this.events.length > 8) {
      this.events.length = 8;
    }
    this.cd.detectChanges();
  }

  private buildAsyncPalette(): Observable<ColorOption[]> {
    return of<ColorOption[]>([
      { color: '#6A7FDB', name: 'Periwinkle' },
      { color: '#9D8DF1', name: 'Iris' },
      { color: '#C4F1BE', name: 'Spring' },
      { color: '#F6E58D', name: 'Lemonade' },
      { color: '#FF7979', name: 'Punch' },
    ]).pipe(delay(1200));
  }
}
