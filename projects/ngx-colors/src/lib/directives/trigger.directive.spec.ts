import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxColorsTriggerDirective } from './trigger.directive';
import { NgxColorsComponent } from '../../public-api';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
      imports: [NgxColorsTriggerDirective, NgxColorsComponent, FormsModule],
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
      imports: [NgxColorsTriggerDirective, NgxColorsComponent, FormsModule],
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
      imports: [NgxColorsTriggerDirective, NgxColorsComponent],
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
      imports: [NgxColorsTriggerDirective, NgxColorsComponent],
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
