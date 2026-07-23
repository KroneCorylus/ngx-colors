export const SNIPPETS = {
  basic: `<ngx-colors ngxColorsTrigger [(ngModel)]="color"></ngx-colors>`,

  customTrigger: `<button
  ngxColorsTrigger
  [(ngModel)]="color"
  [style.background]="color"
  class="my-swatch"
></button>`,

  reactiveHtml: `<ngx-colors ngxColorsTrigger [formControl]="control"></ngx-colors>
<input [formControl]="control" />
<span *ngIf="control.hasError('invalidColor')">Not a valid color</span>`,

  reactiveTs: `import { colorValidator } from 'ngx-colors';

control = new FormControl('#7ae582', [colorValidator()]);`,

  formsFree: `<ngx-colors
  ngxColorsTrigger
  [(color)]="color"
  (userChange)="onUserPick($event)"
></ngx-colors>`,

  customPaletteHtml: `<ngx-colors ngxColorsTrigger [(ngModel)]="color" [palette]="palette"></ngx-colors>`,

  customPaletteTs: `import { ColorOption } from 'ngx-colors';

palette: ColorOption[] = [
  '#FF5E5B',
  { color: '#68C5DB', name: 'Lagoon' },
  {
    color: '#B388FF',
    name: 'Purples',
    childs: ['#EDE7F6', '#B39DDB', '#B388FF', '#7E57C2', '#4527A0'],
  },
];`,

  asyncPaletteHtml: `<ngx-colors ngxColorsTrigger [(ngModel)]="color" [palette]="palette$"></ngx-colors>`,

  asyncPaletteTs: `palette$: Observable<ColorOption[]> = this.http
  .get<ColorOption[]>('/api/brand-colors');`,

  mostUsedService: `@Injectable({ providedIn: 'root' })
export class MostUsedColorsService {
  private readonly subjects = new Map<string, BehaviorSubject<ColorOption[]>>();

  palette(key: string): Observable<ColorOption[]> {
    return this.subject(key).asObservable();
  }

  registerUse(key: string, color: string | null | undefined): void {
    if (!color) return;
    const usage = this.load(key);
    const normalized = color.toLowerCase();
    usage[normalized] = {
      count: (usage[normalized]?.count ?? 0) + 1,
      lastUsed: Date.now(),
    };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(usage));
    this.subject(key).next(this.toPalette(usage));
  }

  private toPalette(usage: Usage): ColorOption[] {
    const mostUsed = Object.entries(usage)
      .sort(([, a], [, b]) => b.count - a.count || b.lastUsed - a.lastUsed)
      .slice(0, MAX_COLORS)
      .map(([color]) => color);
    const seeds = SEED_COLORS.filter((seed) => !mostUsed.includes(seed))
      .slice(0, Math.max(0, MAX_COLORS - mostUsed.length));
    return [...mostUsed, ...seeds];
  }
  // subject() and load() omitted - see the repo for the full service
}`,

  mostUsedTs: `private mostUsed = inject(MostUsedColorsService);

mostUsedPalette$ = this.mostUsed.palette('editor');

onPick(color: string | null | undefined): void {
  this.mostUsed.registerUse('editor', color);
}`,

  mostUsedHtml: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [palette]="mostUsedPalette$"
  (userChange)="onPick($event)"
></ngx-colors>`,

  outputModel: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  outputModel="HEXA"
  [allowedModels]="['HEXA', 'RGBA']"
></ngx-colors>`,

  confirmation: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [confirmationRequired]="{ palette: true, text: true, sliders: true }"
  [labels]="{ accept: 'Apply', cancel: 'Discard' }"
></ngx-colors>`,

  lockValues: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [display]="{ palette: false, text: false, sliders: true }"
  [lockValues]="{ hue: 210, saturation: 0.8, brightness: 0.9, clamp: true }"
  layout="full-horizontal"
></ngx-colors>`,

  themeDark: `<ngx-colors ngxColorsTrigger [(ngModel)]="color" theme="dark"></ngx-colors>
<!-- theme="auto" follows the OS prefers-color-scheme -->`,

  themeCustomHtml: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [overlayClass]="'brand-theme'"
></ngx-colors>`,

  themeCustomCss: `/* global stylesheet - the overlay is appended to <body>,
   so scope the tokens with the overlayClass (not a wrapper) */
.brand-theme {
  --ngx-colors-surface: #2a1a3e;
  --ngx-colors-text: #e0d4f5;
  --ngx-colors-text-strong: #ffffff;
  --ngx-colors-border: #4a3a5e;
  --ngx-colors-hover: rgba(255, 255, 255, 0.1);
  --ngx-colors-radius: 14px;
}`,

  grayscaleHtml: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [palette]="grayscale"
  [lockValues]="{ hue: 0, saturation: 0, clamp: true }"
></ngx-colors>`,

  grayscaleTs: `grayscale: ColorOption[] = [
  '#ffffff', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575',
  '#616161', '#424242', '#212121', '#000000',
];`,

  paletteOnly: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [display]="{ palette: true, sliders: false, text: false }"
  animation="slide"
></ngx-colors>`,

  eyedropper: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  [eyedropper]="true"
></ngx-colors>`,

  events: `<ngx-colors
  ngxColorsTrigger
  [(ngModel)]="color"
  (colorChange)="log('colorChange', $event)"
  (userChange)="log('userChange', $event)"
  (sliderChange)="log('sliderChange', $event)"
  (colorHover)="log('colorHover', $event)"
  (open)="log('open')"
  (close)="log('close')"
></ngx-colors>`,
};
