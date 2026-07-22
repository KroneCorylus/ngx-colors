import { Component, DebugElement, SimpleChange, Type } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxColorsTriggerDirective } from './trigger.directive';
import { NgxColorsComponent } from '../../public-api';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NGX_COLORS_CONFIG } from '../interfaces/configuration';
import { StateService } from '../services/state.service';
import { Rgba } from '../models/rgba';

@Component({
  template: ` <ngx-colors ngxColorsTrigger [(ngModel)]="value"></ngx-colors> `,
})
class HostComponent {
  value: string = '#ff00ff';
}

describe('NgxColorsTriggerDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let elementsWithDirective: Array<DebugElement>;
  let directives: Array<NgxColorsTriggerDirective>;
  let ngxColors: Array<NgxColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAll(
      By.directive(NgxColorsTriggerDirective)
    );
    directives = elementsWithDirective.map((de: DebugElement) =>
      de.injector.get(NgxColorsTriggerDirective)
    );
    ngxColors = elementsWithDirective.map((de: DebugElement) =>
      de.injector.get(NgxColorsComponent)
    );
  });

  it('should create', () => {
    expect(directives.length).toBeTruthy();
  });
  it('directive should have the value of ngModel', () => {
    expect(directives[0].value).toBe('#ff00ff');
  });
  it('ngx-colors should show the initial ngModel value as its preview', () => {
    expect(ngxColors[0].previewColor).toBe('rgb(255, 0, 255)');
  });
  it('should open overlay on click', () => {
    elementsWithDirective[0].triggerEventHandler('click', {});
    const overlay =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlay).toBeTruthy();
  });
  it('stamps dir="ltr" on the overlay for an LTR trigger', () => {
    elementsWithDirective[0].triggerEventHandler('click', {});
    const overlay = document.body.querySelector('ngx-colors-overlay');
    expect(overlay?.getAttribute('dir')).toBe('ltr');
  });
});

@Component({
  template: `
    <ngx-colors
      *ngIf="show"
      ngxColorsTrigger
      [(ngModel)]="value"
    ></ngx-colors>
  `,
})
class ToggleableHostComponent {
  show = true;
  value = '#ff00ff';
}

describe('NgxColorsTriggerDirective overlay cleanup', () => {
  let fixture: ComponentFixture<ToggleableHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleableHostComponent],
      imports: [
        CommonModule,
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      // A minimal config is enough here: these tests exercise overlay
      // lifecycle, not the configuration merge itself.
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(ToggleableHostComponent);
    fixture.detectChanges();
  });

  function getTriggerElement(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngxColorsTrigger]');
  }

  function overlayCount(): number {
    return document.body.getElementsByTagName('ngx-colors-overlay').length;
  }

  it('removes the overlay from the DOM when the trigger host is destroyed while the panel is open', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(overlayCount()).toBe(1);

    fixture.componentInstance.show = false;
    fixture.detectChanges();

    expect(overlayCount()).toBe(0);
  });

  it('does not leave a stray overlay behind across repeated open/destroy cycles', () => {
    for (let i = 0; i < 3; i++) {
      fixture.componentInstance.show = true;
      fixture.detectChanges();
      getTriggerElement().dispatchEvent(new Event('click'));
      fixture.detectChanges();
      fixture.componentInstance.show = false;
      fixture.detectChanges();
    }
    expect(overlayCount()).toBe(0);
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [(ngModel)]="value"
      (open)="onOpen()"
      (close)="onClose()"
    ></ngx-colors>
  `,
})
class OpenCloseHostComponent {
  value = '#ff00ff';
  openCount = 0;
  closeCount = 0;
  onOpen() {
    this.openCount++;
  }
  onClose() {
    this.closeCount++;
  }
}

describe('NgxColorsTriggerDirective open/close outputs', () => {
  let fixture: ComponentFixture<OpenCloseHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenCloseHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(OpenCloseHostComponent);
    fixture.detectChanges();
  });

  function getTriggerElement(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngxColorsTrigger]');
  }

  function getOverlayElement(): HTMLElement {
    const overlay = document.body.querySelector('ngx-colors-overlay');
    if (!overlay) {
      throw new Error('Expected an open overlay in the document');
    }
    return overlay as HTMLElement;
  }

  it('emits (open) when the trigger is clicked', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.openCount).toBe(1);
    expect(fixture.componentInstance.closeCount).toBe(0);
  });

  it('emits (close) when the panel is closed by clicking outside it', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    getOverlayElement().dispatchEvent(new Event('pointerdown'));
    fixture.detectChanges();

    expect(fixture.componentInstance.openCount).toBe(1);
    expect(fixture.componentInstance.closeCount).toBe(1);
  });

  it('emits open/close in the right order across repeated open/close cycles', () => {
    for (let i = 0; i < 3; i++) {
      getTriggerElement().dispatchEvent(new Event('click'));
      fixture.detectChanges();
      getOverlayElement().dispatchEvent(new Event('pointerdown'));
      fixture.detectChanges();
    }

    expect(fixture.componentInstance.openCount).toBe(3);
    expect(fixture.componentInstance.closeCount).toBe(3);
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [(color)]="value"
      (colorChange)="onColorChange($event)"
      (userChange)="onUserChange($event)"
    ></ngx-colors>
  `,
})
class ColorInputHostComponent {
  value: string | null | undefined = '#ff00ff';
  colorChanges: Array<string | null | undefined> = [];
  userChanges: Array<string | null | undefined> = [];
  onColorChange(v: string | null | undefined) {
    this.colorChanges.push(v);
  }
  onUserChange(v: string | null | undefined) {
    this.userChanges.push(v);
  }
}

describe('NgxColorsTriggerDirective forms-free [color]/(colorChange)/(userChange)', () => {
  let fixture: ComponentFixture<ColorInputHostComponent>;
  let directive: NgxColorsTriggerDirective;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorInputHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(ColorInputHostComponent);
    fixture.detectChanges();
    const de = fixture.debugElement.query(
      By.directive(NgxColorsTriggerDirective),
    );
    directive = de.injector.get(NgxColorsTriggerDirective);
    stateService = de.injector.get(StateService);
  });

  it('adopts the initial [color] value with no Forms directive present', () => {
    expect(directive.value).toBe('#ff00ff');
  });

  it('applies external [color] changes and emits colorChange but not userChange', () => {
    fixture.componentInstance.value = '#00ff00';
    fixture.detectChanges();

    expect(directive.value).toBe('#00ff00');
    expect(fixture.componentInstance.colorChanges).toContain('#00ff00');
    expect(fixture.componentInstance.userChanges).toEqual([]);
  });

  it('emits both colorChange and userChange for every user-driven origin', () => {
    const userOrigins: Array<'sliders' | 'palette' | 'text' | 'confirm'> = [
      'sliders',
      'palette',
      'text',
      'confirm',
    ];
    for (const origin of userOrigins) {
      stateService.set({ value: new Rgba(1, 2, 3, 1), origin });
    }
    fixture.detectChanges();

    expect(fixture.componentInstance.userChanges.length).toBe(
      userOrigins.length,
    );
    expect(
      fixture.componentInstance.colorChanges.length,
    ).toBeGreaterThanOrEqual(userOrigins.length);
  });

  it('does not emit userChange for the "state" origin (programmatic writes)', () => {
    const userChangesBefore = fixture.componentInstance.userChanges.length;
    stateService.set({ value: new Rgba(9, 8, 7, 1), origin: 'state' });
    fixture.detectChanges();

    expect(fixture.componentInstance.userChanges.length).toBe(
      userChangesBefore,
    );
    expect(fixture.componentInstance.colorChanges.length).toBeGreaterThan(0);
  });

  it('round-trips through [(color)] when a user-driven change happens', () => {
    stateService.set({ value: new Rgba(10, 20, 30, 1), origin: 'palette' });
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe(directive.value);
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [color]="value"
      [palette]="palette"
      [outputModel]="'HEXA'"
      (colorChange)="onColorChange($event)"
      (userChange)="onUserChange($event)"
    ></ngx-colors>
  `,
})
class FlatPaletteHostComponent {
  value: string | null = null;
  palette: string[] = ['#ff0000', '#00ff00', '#0000ff'];
  colorChanges: Array<string | null | undefined> = [];
  userChanges: Array<string | null | undefined> = [];
  onColorChange(v: string | null | undefined) {
    this.colorChanges.push(v);
  }
  onUserChange(v: string | null | undefined) {
    this.userChanges.push(v);
  }
}

describe('NgxColorsTriggerDirective forms-free end-to-end palette selection', () => {
  let fixture: ComponentFixture<FlatPaletteHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlatPaletteHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(FlatPaletteHostComponent);
    fixture.detectChanges();
  });

  function getTriggerElement(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngxColorsTrigger]');
  }

  it('emits colorChange and userChange when a real palette swatch is clicked, with no Forms module involved', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const swatch = document.body.querySelector<HTMLElement>(
      '.circle._color-option.bg-transparent',
    );
    if (!swatch) {
      throw new Error('Expected a palette swatch to be rendered');
    }
    swatch.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.colorChanges.at(-1)).toBe('#ff0000');
    expect(fixture.componentInstance.userChanges.at(-1)).toBe('#ff0000');
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [(ngModel)]="value"
      [disabled]="isDisabled"
    ></ngx-colors>
  `,
})
class DisabledHostComponent {
  value: string | null = '#ff00ff';
  isDisabled = false;
}

describe('NgxColorsTriggerDirective disabled state', () => {
  let fixture: ComponentFixture<DisabledHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisabledHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(DisabledHostComponent);
    fixture.detectChanges();
  });

  function getTriggerElement(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngxColorsTrigger]');
  }

  function overlayCount(): number {
    return document.body.getElementsByTagName('ngx-colors-overlay').length;
  }

  it('does not open the panel on click while disabled', () => {
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();

    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(overlayCount()).toBe(0);
  });

  it('opens the panel normally once re-enabled', () => {
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();
    fixture.componentInstance.isDisabled = false;
    fixture.detectChanges();

    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(overlayCount()).toBe(1);
  });

  it('ignores direct openPanel() calls while disabled, not just clicks', () => {
    const de = fixture.debugElement.query(
      By.directive(NgxColorsTriggerDirective),
    );
    const directive: NgxColorsTriggerDirective = de.injector.get(
      NgxColorsTriggerDirective,
    );
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();

    directive.openPanel();

    expect(overlayCount()).toBe(0);
  });

  it('dims the host element and marks it aria-disabled', () => {
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();

    const el = getTriggerElement();
    expect(el.style.opacity).toBe('0.5');
    expect(el.style.pointerEvents).toBe('none');
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('restores full opacity and interactivity when re-enabled', () => {
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();
    fixture.componentInstance.isDisabled = false;
    fixture.detectChanges();

    const el = getTriggerElement();
    expect(el.style.opacity).toBe('1');
    expect(el.style.pointerEvents).toBe('auto');
    expect(el.getAttribute('aria-disabled')).toBe('false');
  });
});

@Component({
  template: ` <ngx-colors ngxColorsTrigger [formControl]="control"></ngx-colors> `,
})
class ReactiveDisabledHostComponent {
  control = new FormControl<string | null>('#ff00ff');
}

describe('NgxColorsTriggerDirective disabled state via FormControl.disable()', () => {
  let fixture: ComponentFixture<ReactiveDisabledHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactiveDisabledHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(ReactiveDisabledHostComponent);
    fixture.detectChanges();
  });

  function getTriggerElement(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngxColorsTrigger]');
  }

  function overlayCount(): number {
    return document.body.getElementsByTagName('ngx-colors-overlay').length;
  }

  it('does not open the panel on click once the FormControl is disabled', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(overlayCount()).toBe(0);
  });

  it('opens the panel again once the FormControl is re-enabled', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    fixture.componentInstance.control.enable();
    fixture.detectChanges();

    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(overlayCount()).toBe(1);
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [(ngModel)]="value"
      [display]="{ palette: false, sliders: true, text: false }"
      (close)="onClose()"
      (userChange)="onUserChange($event)"
    ></ngx-colors>
  `,
})
class CancelHostComponent {
  value: string | null = '#ff00ff';
  closeCount = 0;
  userChanges: Array<string | null | undefined> = [];
  onClose() {
    this.closeCount++;
  }
  onUserChange(v: string | null | undefined) {
    this.userChanges.push(v);
  }
}

describe('NgxColorsTriggerDirective Cancel behavior', () => {
  let fixture: ComponentFixture<CancelHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(CancelHostComponent);
    fixture.detectChanges();
  });

  function getTriggerElement(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngxColorsTrigger]');
  }

  function overlayCount(): number {
    return document.body.getElementsByTagName('ngx-colors-overlay').length;
  }

  function getCancelButton(): HTMLButtonElement {
    const overlay = document.body.querySelector('ngx-colors-overlay');
    if (!overlay) {
      throw new Error('Expected an open overlay in the document');
    }
    const cancelButton = Array.from(
      overlay.querySelectorAll<HTMLButtonElement>('button'),
    ).find((b) => b.textContent?.trim() === 'CANCEL');
    if (!cancelButton) {
      throw new Error('Expected a CANCEL button to be rendered');
    }
    return cancelButton;
  }

  it('closes the panel on Cancel even when nothing was changed since opening', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(overlayCount()).toBe(1);

    getCancelButton().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(overlayCount()).toBe(0);
  });

  it('leaves the bound value unchanged after Cancel', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    getCancelButton().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('#ff00ff');
  });

  it('emits (close) but not (userChange) when Cancel is clicked', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();
    fixture.componentInstance.userChanges = [];

    getCancelButton().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.closeCount).toBe(1);
    expect(fixture.componentInstance.userChanges).toEqual([]);
  });

  it('closes reliably across repeated open/cancel cycles', () => {
    for (let i = 0; i < 3; i++) {
      getTriggerElement().dispatchEvent(new Event('click'));
      fixture.detectChanges();
      getCancelButton().dispatchEvent(new Event('click'));
      fixture.detectChanges();
    }
    expect(overlayCount()).toBe(0);
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [formControl]="control"
      [palette]="palette"
    ></ngx-colors>
  `,
})
class CvaDirtyHostComponent {
  control = new FormControl<string | null>('#ff00ff');
  palette: string[] = ['#00ff00', '#0000ff'];
}

describe('NgxColorsTriggerDirective ControlValueAccessor dirty/pristine behavior', () => {
  let fixture: ComponentFixture<CvaDirtyHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CvaDirtyHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(CvaDirtyHostComponent);
    fixture.detectChanges();
  });

  function getTriggerElement(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngxColorsTrigger]');
  }

  it('stays pristine after the initial value is written', () => {
    expect(fixture.componentInstance.control.pristine).toBe(true);
  });

  it('stays pristine after a subsequent programmatic setValue()', () => {
    fixture.componentInstance.control.setValue('#00ff00');
    fixture.detectChanges();

    expect(fixture.componentInstance.control.pristine).toBe(true);
  });

  it('becomes dirty once the user actually picks a color', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const swatch = document.body.querySelector<HTMLElement>(
      '.circle._color-option.bg-transparent',
    );
    if (!swatch) {
      throw new Error('Expected a palette swatch to be rendered');
    }
    swatch.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.dirty).toBe(true);
    expect(fixture.componentInstance.control.value).toBe('#00ff00');
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [(ngModel)]="value"
      [outputModel]="'AUTO'"
      [palette]="palette"
    ></ngx-colors>
  `,
})
class AutoOutputModelHostComponent {
  value: string | null = '#ff00ff';
  palette: string[] = ['#00ff00', '#0000ff'];
}

describe('NgxColorsTriggerDirective outputModel: "AUTO" literal binding', () => {
  let fixture: ComponentFixture<AutoOutputModelHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoOutputModelHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(AutoOutputModelHostComponent);
    fixture.detectChanges();
  });

  function getTriggerElement(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngxColorsTrigger]');
  }

  it('accepts a literal [outputModel]="\'AUTO\'" binding, which used to fail to compile under strictTemplates', () => {
    const de = fixture.debugElement.query(
      By.directive(NgxColorsTriggerDirective),
    );
    const directive: NgxColorsTriggerDirective = de.injector.get(
      NgxColorsTriggerDirective,
    );
    expect(directive.outputModel).toBe('AUTO');
  });

  it('formats subsequent picks to match the format the value was originally set in', () => {
    getTriggerElement().dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const swatch = document.body.querySelector<HTMLElement>(
      '.circle._color-option.bg-transparent',
    );
    if (!swatch) {
      throw new Error('Expected a palette swatch to be rendered');
    }
    swatch.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('#00ff00');
  });
});

@Component({
  template: `
    <div
      ngxColorsTrigger
      [(ngModel)]="value"
      style="position: fixed; width: 20px; height: 20px"
    ></div>
  `,
})
class BottomEdgeHostComponent {
  value: string | null = '#ff00ff';
}

describe('NgxColorsTriggerDirective first-open smart positioning', () => {
  let fixture: ComponentFixture<BottomEdgeHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BottomEdgeHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(BottomEdgeHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body
      .querySelector('ngx-colors-overlay')
      ?.dispatchEvent(new Event('pointerdown'));
    fixture.detectChanges();
  });

  it('flips the panel above a trigger at the bottom of the viewport on first open, before any scroll', () => {
    const trigger: HTMLElement =
      fixture.nativeElement.querySelector('[ngxColorsTrigger]');
    trigger.style.top = `${window.innerHeight - 30}px`;
    trigger.style.left = '10px';

    trigger.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const panel = document.body.querySelector<HTMLElement>(
      'ngx-colors-overlay ngx-colors-panel',
    );
    if (!panel) {
      throw new Error('Expected an open panel in the document');
    }
    const panelRect = panel.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();

    expect(panelRect.height).toBeGreaterThan(0);
    expect(panelRect.bottom).toBeLessThanOrEqual(window.innerHeight);
    expect(panelRect.top).toBeLessThan(triggerRect.top);
  });
});

@Component({
  template: `
    <div dir="rtl">
      <div
        ngxColorsTrigger
        [(ngModel)]="value"
        style="position: fixed; top: 10px; width: 20px; height: 20px"
      ></div>
    </div>
  `,
})
class RtlHostComponent {
  value: string | null = '#ff00ff';
}

describe('NgxColorsTriggerDirective RTL positioning', () => {
  let fixture: ComponentFixture<RtlHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RtlHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(RtlHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body
      .querySelector('ngx-colors-overlay')
      ?.dispatchEvent(new Event('pointerdown'));
    fixture.detectChanges();
  });

  it('aligns the panel right edge with the trigger right edge under dir="rtl"', () => {
    const trigger: HTMLElement =
      fixture.nativeElement.querySelector('[ngxColorsTrigger]');
    trigger.style.left = '400px';

    trigger.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const panel = document.body.querySelector<HTMLElement>(
      'ngx-colors-overlay ngx-colors-panel',
    );
    if (!panel) {
      throw new Error('Expected an open panel in the document');
    }
    const panelRect = panel.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();

    expect(panelRect.width).toBeGreaterThan(0);
    expect(Math.abs(panelRect.right - triggerRect.right)).toBeLessThanOrEqual(
      1,
    );
  });

  it('stamps the trigger direction on the overlay so its content mirrors', () => {
    const trigger: HTMLElement =
      fixture.nativeElement.querySelector('[ngxColorsTrigger]');
    trigger.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const overlay = document.body.querySelector('ngx-colors-overlay');
    expect(overlay?.getAttribute('dir')).toBe('rtl');
  });

  it('renders the palette back icon mirrored under dir="rtl"', () => {
    const trigger: HTMLElement =
      fixture.nativeElement.querySelector('[ngxColorsTrigger]');
    trigger.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const groupSwatch = document.body.querySelector<HTMLElement>(
      'ngx-colors-overlay .circle._color-option.bg-transparent',
    );
    if (!groupSwatch) {
      throw new Error('Expected a palette group swatch to be rendered');
    }
    groupSwatch.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const backButton = document.body.querySelector<HTMLElement>(
      'ngx-colors-overlay [aria-label="back"]',
    );
    if (!backButton) {
      throw new Error('Expected a back button to be rendered');
    }
    expect(getComputedStyle(backButton).transform).toBe(
      'matrix(-1, 0, 0, 1, 0, 0)',
    );
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      (colorChange)="onColorChange($event)"
    ></ngx-colors>
  `,
})
class NoInitialValueHostComponent {
  colorChanges: Array<string | null | undefined> = [];
  onColorChange(v: string | null | undefined) {
    this.colorChanges.push(v);
  }
}

describe('NgxColorsTriggerDirective colorChange emission hygiene', () => {
  let fixture: ComponentFixture<NoInitialValueHostComponent>;
  let directive: NgxColorsTriggerDirective;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoInitialValueHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(NoInitialValueHostComponent);
    fixture.detectChanges();
    const de = fixture.debugElement.query(
      By.directive(NgxColorsTriggerDirective),
    );
    directive = de.injector.get(NgxColorsTriggerDirective);
    stateService = de.injector.get(StateService);
  });

  it('does not emit colorChange(null) on init when no value is bound', () => {
    expect(fixture.componentInstance.colorChanges).toEqual([]);
  });

  it('does not re-emit colorChange for a programmatic write of the same value', () => {
    stateService.set({ value: new Rgba(1, 2, 3, 1), origin: 'state' });
    stateService.set({ value: new Rgba(1, 2, 3, 1), origin: 'state' });
    fixture.detectChanges();

    expect(fixture.componentInstance.colorChanges).toEqual(['rgb(1, 2, 3)']);
  });

  it('still emits colorChange for repeated user-driven picks of the same value', () => {
    stateService.set({ value: new Rgba(1, 2, 3, 1), origin: 'palette' });
    stateService.set({ value: new Rgba(1, 2, 3, 1), origin: 'palette' });
    fixture.detectChanges();

    expect(fixture.componentInstance.colorChanges.length).toBe(2);
  });

  it('stops reacting to state changes once the host is destroyed', () => {
    const emissions: Array<string | null | undefined> = [];
    directive.colorChange.subscribe((v: string | null | undefined) =>
      emissions.push(v),
    );
    fixture.destroy();
    stateService.set({ value: new Rgba(9, 9, 9, 1), origin: 'state' });

    expect(emissions).toEqual([]);
  });

  it('applies an updated [palette] input to the palette stream', (done) => {
    directive.palette = ['#123456'];
    directive.ngOnChanges({
      palette: new SimpleChange(undefined, ['#123456'], false),
    });
    if (!stateService.palette$) {
      fail('palette$ should be defined');
      return;
    }
    stateService.palette$.subscribe((colors) => {
      expect(colors).toEqual(['#123456']);
      done();
    });
  });
});

@Component({
  template: ` <ngx-colors ngxColorsTrigger [(ngModel)]="value"></ngx-colors> `,
})
class TokenPaletteHostComponent {
  value: string | null = '#ff00ff';
}

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [(ngModel)]="value"
      [palette]="palette"
    ></ngx-colors>
  `,
})
class TokenPlusInputPaletteHostComponent {
  value: string | null = '#ff00ff';
  palette = ['#abcdef'];
}

describe('NgxColorsTriggerDirective palette via NGX_COLORS_CONFIG', () => {
  function setup<T>(host: Type<T>): StateService {
    TestBed.configureTestingModule({
      declarations: [host],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: NGX_COLORS_CONFIG,
          useValue: { palette: ['#123456', '#654321'] },
        },
      ],
    });
    const fixture = TestBed.createComponent(host);
    fixture.detectChanges();
    return fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(StateService);
  }

  it('feeds the palette stream from the global config when no input is bound', async () => {
    const stateService = setup(TokenPaletteHostComponent);
    if (!stateService.palette$) {
      fail('palette$ should be defined');
      return;
    }
    const colors = await firstValueFrom(stateService.palette$);
    expect(colors).toEqual(['#123456', '#654321']);
  });

  it('lets the [palette] input win over the global config', async () => {
    const stateService = setup(TokenPlusInputPaletteHostComponent);
    if (!stateService.palette$) {
      fail('palette$ should be defined');
      return;
    }
    const colors = await firstValueFrom(stateService.palette$);
    expect(colors).toEqual(['#abcdef']);
  });
});
