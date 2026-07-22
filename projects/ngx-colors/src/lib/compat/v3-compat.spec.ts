import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { firstValueFrom } from 'rxjs';
import { NgxColorsTriggerDirective } from '../directives/trigger.directive';
import { NgxColorsComponent } from '../components/ngx-colors/ngx-colors.component';
import { StateService } from '../services/state.service';
import { Rgba } from '../models/rgba';
import { ColorValidator } from '../validators/color-validator';
import {
  NgxColorsColor,
  translateLegacyPalette,
  validColorValidator,
} from './v3-compat';

@Component({
  template: `
    <ngx-colors
      ngx-colors-trigger
      [(ngModel)]="value"
      colorsAnimation="slide-in"
      format="hex"
      [hideTextInput]="true"
      [hideColorPicker]="true"
      attachTo="legacy-parent"
      overlayClassName="legacy-overlay"
      acceptLabel="OK!"
      cancelLabel="NO!"
      colorPickerControls="no-alpha"
      (change)="changes.push($event)"
      (input)="inputs.push($event)"
      (slider)="sliders.push($event)"
    ></ngx-colors>
  `,
})
class LegacyHostComponent {
  value: string | null = '#ff00ff';
  changes: Array<string | null | undefined> = [];
  inputs: Array<string | null | undefined> = [];
  sliders: Array<string | null> = [];
}

describe('v3 compat: legacy selector, inputs and outputs', () => {
  let fixture: ComponentFixture<LegacyHostComponent>;
  let directive: NgxColorsTriggerDirective;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegacyHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LegacyHostComponent);
    fixture.detectChanges();
    const de = fixture.debugElement.query(
      By.directive(NgxColorsTriggerDirective),
    );
    directive = de.injector.get(NgxColorsTriggerDirective);
    stateService = de.injector.get(StateService);
  });

  it('instantiates the directive through the v3 attribute selector', () => {
    expect(directive).toBeTruthy();
    expect(directive.value).toBe('#ff00ff');
  });

  it('maps colorsAnimation "slide-in" to animation "slide"', () => {
    expect(stateService.configuration.animation).toBe('slide');
  });

  it('maps format "hex" to outputModel HEXA and locks allowedModels', () => {
    expect(stateService.configuration.outputModel).toBe('HEXA');
    expect(stateService.configuration.allowedModels).toEqual(['HEXA']);
  });

  it('maps hideTextInput/hideColorPicker to display options', () => {
    expect(stateService.configuration.display?.text).toBe(false);
    expect(stateService.configuration.display?.sliders).toBe(false);
    expect(stateService.configuration.display?.palette).toBe(true);
  });

  it('maps attachTo and overlayClassName to the overlay options', () => {
    expect(stateService.configuration.overlayAttachTo).toBe('legacy-parent');
    expect(stateService.configuration.overlayClass).toBe('legacy-overlay');
  });

  it('maps acceptLabel/cancelLabel to labels', () => {
    expect(stateService.configuration.labels?.accept).toBe('OK!');
    expect(stateService.configuration.labels?.cancel).toBe('NO!');
  });

  it('maps colorPickerControls "no-alpha" to lockValues.alpha = 1', () => {
    expect(stateService.configuration.lockValues?.alpha).toBe(1);
  });

  it('(change) receives colorChange emissions', () => {
    fixture.componentInstance.changes = [];
    stateService.set({ value: new Rgba(0, 255, 0, 1), origin: 'palette' });
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual(['#00ff00']);
  });

  it('(input) receives userChange emissions only', () => {
    fixture.componentInstance.inputs = [];
    stateService.set({ value: new Rgba(0, 0, 255, 1), origin: 'state' });
    stateService.set({ value: new Rgba(0, 255, 0, 1), origin: 'palette' });
    fixture.detectChanges();

    expect(fixture.componentInstance.inputs).toEqual(['#00ff00']);
  });

  it('(slider) emits a formatted string while sliders move', () => {
    stateService.sliderChange$.emit(new Rgba(255, 0, 0, 1));
    fixture.detectChanges();

    expect(fixture.componentInstance.sliders).toEqual(['#ff0000']);
  });
});

@Component({
  template: `
    <ngx-colors
      ngxColorsTrigger
      [(ngModel)]="value"
      [hideTextInput]="true"
      [display]="{ text: true, sliders: false }"
    ></ngx-colors>
  `,
})
class PrecedenceHostComponent {
  value: string | null = '#ff00ff';
}

describe('v3 compat: new API wins over legacy inputs', () => {
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrecedenceHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(PrecedenceHostComponent);
    fixture.detectChanges();
    stateService = fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(StateService);
  });

  it('display from the new API overrides the legacy hideTextInput mapping', () => {
    expect(stateService.configuration.display?.text).toBe(true);
    expect(stateService.configuration.display?.sliders).toBe(false);
  });
});

@Component({
  template: `
    <ngx-colors
      ngx-colors-trigger
      [(ngModel)]="value"
      [palette]="palette"
    ></ngx-colors>
  `,
})
class LegacyPaletteHostComponent {
  value: string | null = null;
  palette: Array<NgxColorsColor> = [
    new NgxColorsColor({
      color: 'red',
      preview: '#ff0000',
      variants: ['#aa0000', '#ff0000'],
    }),
  ];
}

describe('v3 compat: legacy palette shape', () => {
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegacyPaletteHostComponent],
      imports: [
        NgxColorsTriggerDirective,
        NgxColorsComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(LegacyPaletteHostComponent);
    fixture.detectChanges();
    stateService = fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(StateService);
  });

  it('translates {preview, variants} items into {color, childs, name}', async () => {
    if (!stateService.palette$) {
      fail('palette$ should be defined');
      return;
    }
    const colors = await firstValueFrom(stateService.palette$);
    expect(colors).toEqual([
      { color: '#ff0000', childs: ['#aa0000', '#ff0000'], name: 'red' },
    ]);
  });
});

describe('v3 compat: standalone helpers', () => {
  it('translateLegacyPalette leaves new-shape options untouched', () => {
    const options = [
      '#ff0000',
      { color: '#00ff00', childs: ['#00aa00'], name: 'green' },
      undefined,
    ];
    expect(translateLegacyPalette(options)).toEqual(options);
  });

  it('validColorValidator is an alias of ColorValidator', () => {
    expect(validColorValidator).toBe(ColorValidator);
    const validate = validColorValidator();
    expect(validate({ value: 'not-a-color' } as AbstractControl)).toEqual({
      invalidColor: true,
    });
    expect(validate({ value: '#ff0000' } as AbstractControl)).toBeNull();
  });
});
