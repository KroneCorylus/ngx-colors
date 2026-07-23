import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { ColorPickerComponent } from './color-picker.component';
import { StateService } from '../../services/state.service';
import { Rgba } from '../../models/rgba';
import { Hsva } from '../../models/hsva';
import { Configuration } from '../../models/configuration';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPickerComponent],
      providers: [StateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChangeCoord', () => {
    let emitted: Array<Rgba | undefined>;

    beforeEach(() => {
      emitted = [];
      component.registerOnChange((value) => emitted.push(value));
    });

    it('hue slider maps x to a 0-360 hue and repaints the hue background', () => {
      component.onChangeCoord('h', [0.5, 0]);

      expect(component._value.h).toBe(180);
      expect(component._hue.h).toBe(180);
      expect(component.hue).toBe('rgb(0, 255, 255)');
      expect(component.value?.toRounded()).toEqual(new Rgba(0, 255, 255, 1));
      expect(component.preview).toBe('rgb(0, 255, 255)');
      expect(emitted.length).toBe(1);
    });

    it('sv slider maps x to saturation and inverted y to brightness', () => {
      component.onChangeCoord('sv', [0.25, 0.4]);

      expect(component._value.s).toBe(0.25);
      expect(component._value.v).toBe(0.6);
      expect(emitted.length).toBe(1);
    });

    it('s slider only changes saturation', () => {
      component.onChangeCoord('s', [0.3, 0]);

      expect(component._value.s).toBe(0.3);
      expect(component._value.v).toBe(1);
    });

    it('v slider only changes brightness', () => {
      component.onChangeCoord('v', [0.7, 0]);

      expect(component._value.v).toBe(0.7);
      expect(component._value.s).toBe(1);
    });

    it('alpha slider maps x to the alpha channel of the emitted value', () => {
      component.onChangeCoord('a', [0.5, 0]);

      expect(component._value.a).toBe(0.5);
      expect(component.value?.a).toBe(0.5);
      expect(emitted[0]?.a).toBe(0.5);
    });

    it('updates the saturation and brightness gradient backgrounds', () => {
      component.onChangeCoord('h', [0.5, 0]);

      expect(component.bgv).toBe('rgb(0, 255, 255)');
      expect(component.bgs?.background).toContain('linear-gradient');
      expect(component.alphaGradient.background).toContain('linear-gradient');
    });
  });

  describe('ngOnChanges', () => {
    it('recomputes the internal HSVA state from the new input value', () => {
      component.ngOnChanges({
        value: new SimpleChange(undefined, new Rgba(0, 0, 255, 1), true),
      });

      expect(component._value.h).toBe(240);
      expect(component._value.s).toBe(1);
      expect(component._value.v).toBe(1);
      expect(component.preview).toBe('rgb(0, 0, 255)');
    });
  });

  describe('writeValue', () => {
    it('does not emit onChange', () => {
      const spy = jasmine.createSpy('onChange');
      component.registerOnChange(spy);

      component.writeValue(new Rgba(255, 0, 0, 1));

      expect(spy).not.toHaveBeenCalled();
    });

    it('converts the written Rgba to HSVA state and updates the preview', () => {
      component.writeValue(new Rgba(255, 0, 0, 1));

      expect(component._value.toRounded()).toEqual(new Hsva(0, 1, 1, 1));
      expect(component.preview).toBe('rgb(255, 0, 0)');
    });

    it('falls back to the default HSVA when the value is cleared', () => {
      component.writeValue(new Rgba(0, 0, 255, 1));
      component.writeValue(undefined);

      expect(component._value).toEqual(new Hsva(1, 1, 1, 1));
    });

    it('initializes from configuration.lockValues when the value is cleared', () => {
      stateService.configuration = new Configuration({
        lockValues: { hue: 200, saturation: 0.5, brightness: 0.8, alpha: 0.3 },
      });

      component.writeValue(undefined);

      expect(component._value).toEqual(new Hsva(200, 0.5, 0.8, 0.3));
      expect(component._hue.h).toBe(200);
    });
  });

  describe('onClickEyeDropper', () => {
    type EyeDropperResult = { sRGBHex: string };
    const win = window as unknown as { EyeDropper?: unknown };
    let originalEyeDropper: unknown;
    let resolveOpen: (result: EyeDropperResult) => void;
    let rejectOpen: (err: Error) => void;

    beforeEach(() => {
      originalEyeDropper = win.EyeDropper;
      win.EyeDropper = class {
        open(): Promise<EyeDropperResult> {
          return new Promise((resolve, reject) => {
            resolveOpen = resolve;
            rejectOpen = reject;
          });
        }
      };
      component.eyeDropperSupport = true;
    });

    afterEach(() => {
      win.EyeDropper = originalEyeDropper;
    });

    it('logs an error and does nothing when the API is unsupported', () => {
      const errorSpy = spyOn(console, 'error');
      const changeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(changeSpy);
      component.eyeDropperSupport = false;

      component.onClickEyeDropper();

      expect(errorSpy).toHaveBeenCalledWith('EyeDropper not supported');
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('applies the picked color with alpha forced to 1', async () => {
      component.onClickEyeDropper();
      resolveOpen({ sRGBHex: '#336699' });
      await fixture.whenStable();

      expect(component.value).toEqual(new Rgba(51, 102, 153, 1));
      expect(component.preview).toBe('rgb(51, 102, 153)');
    });

    it('logs the error when the user dismisses the eyedropper', async () => {
      const errorSpy = spyOn(console, 'error');
      const abort = new Error('The user canceled the selection.');

      component.onClickEyeDropper();
      rejectOpen(abort);
      await new Promise((resolve) => setTimeout(resolve));

      expect(errorSpy).toHaveBeenCalledWith(abort);
    });
  });

  describe('setDisabledState', () => {
    it('toggles the disabled flag', () => {
      component.setDisabledState?.(true);
      expect(component.disabled).toBeTrue();
      component.setDisabledState?.(false);
      expect(component.disabled).toBeFalse();
    });
  });
});
