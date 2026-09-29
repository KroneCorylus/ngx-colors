import { Component, ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { NgxColorsTriggerDirective } from './trigger.directive';
import { NGX_COLORS_CONFIG } from '../interfaces/configuration';
import { ColorOption } from '../types/color-option';
import { assertModernPalette } from '../utility/removed-api';

@Component({
  imports: [NgxColorsTriggerDirective, FormsModule, ReactiveFormsModule],
  template: '<button ngxColorsTrigger [palette]="palette">Pick</button>',
})
class MigrationHost {
  palette: ColorOption[] | Subject<ColorOption[]> | undefined;
  value: string | undefined;
  control = new FormControl('#ff0000');
  form = new FormGroup({ color: this.control });
}

describe('Removed v3 API diagnostics', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [MigrationHost] }),
  );

  for (const [attribute, replacement] of [
    ['ngx-colors-trigger', 'ngxColorsTrigger'],
    ['colorsAnimation="slide-in"', 'animation'],
    ['format="hex"', 'outputModel'],
    ['formats="hex"', 'allowedModels'],
    ['hideTextInput="true"', 'display'],
    ['hideColorPicker="true"', 'display'],
    ['attachTo="container"', 'overlayAttachTo'],
    ['overlayClassName="picker"', 'overlayClass'],
    ['acceptLabel="OK"', 'labels'],
    ['cancelLabel="Back"', 'labels'],
    ['colorPickerControls="no-alpha"', 'lockValues'],
  ]) {
    it(`rejects the literal ${attribute} with its replacement`, () => {
      const selector =
        attribute === 'ngx-colors-trigger' ? '' : 'ngxColorsTrigger';
      TestBed.overrideTemplate(
        MigrationHost,
        `<button ${selector} ${attribute}></button>`,
      );
      expect(() => {
        const fixture = TestBed.createComponent(MigrationHost);
        fixture.detectChanges();
      }).toThrowError(new RegExp(`ngx-colors:.*removed in v5.*${replacement}`));
    });
  }

  it('rejects a legacy palette provided through an input', () => {
    const fixture = TestBed.createComponent(MigrationHost);
    fixture.componentInstance.palette = [
      { preview: '#ff0000' },
    ] as unknown as ColorOption[];
    expect(() => fixture.detectChanges()).toThrowError(
      /palette\[0\].*v3 palette API/,
    );
  });

  it('rejects a legacy palette provided through global configuration', () => {
    TestBed.overrideProvider(NGX_COLORS_CONFIG, {
      useValue: { palette: [{ preview: '#ff0000' }] },
    });
    const fixture = TestBed.createComponent(MigrationHost);
    expect(() => fixture.detectChanges()).toThrowError(
      /palette\[0\].*v3 palette API/,
    );
  });

  it('reports a nested legacy palette from a live observable to ErrorHandler', () => {
    const handleError = jasmine.createSpy('handleError');
    TestBed.overrideProvider(ErrorHandler, { useValue: { handleError } });
    const fixture = TestBed.createComponent(MigrationHost);
    const palette = new Subject<ColorOption[]>();
    fixture.componentInstance.palette = palette;
    fixture.detectChanges();
    const directive = fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(NgxColorsTriggerDirective);
    directive.openPanel();
    palette.next([
      { color: '#ff0000', childs: [{ preview: '#00ff00' }] },
    ] as unknown as ColorOption[]);

    expect(handleError).toHaveBeenCalledOnceWith(jasmine.any(Error));
    expect(handleError.calls.mostRecent().args[0].message).toContain(
      'palette[0].childs[0]',
    );
    directive.closePanel();
  });

  it('keeps modern nested palettes and empty swatches intact', () => {
    const palette = [
      '#ff0000',
      undefined,
      { color: undefined, name: 'Group', childs: ['#00ff00'] },
    ];
    expect(() => assertModernPalette(palette)).not.toThrow();
    expect(palette[1]).toBeUndefined();
  });
});

describe('Picker value ownership', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [MigrationHost] }),
  );

  for (const template of [
    '<button ngxColorsTrigger [color]="value" [(ngModel)]="value"></button>',
    '<button ngxColorsTrigger [(color)]="value" [formControl]="control"></button>',
    '<form [formGroup]="form"><button ngxColorsTrigger [color]="value" formControlName="color"></button></form>',
  ]) {
    it(`rejects competing value bindings: ${template}`, () => {
      TestBed.overrideTemplate(MigrationHost, template);
      const fixture = TestBed.createComponent(MigrationHost);
      expect(() => fixture.detectChanges()).toThrowError(
        /use either.*Angular Forms/,
      );
    });
  }
});
