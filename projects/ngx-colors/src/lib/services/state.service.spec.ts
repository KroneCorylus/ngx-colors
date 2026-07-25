import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { Configuration } from '../models/configuration';
import { Rgba } from '../models/rgba';
import { take } from 'rxjs';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [StateService] });
    service = TestBed.inject(StateService);
  });

  function latestValue(): Rgba | null | undefined {
    let value: Rgba | null | undefined;
    service.state.pipe(take(1)).subscribe((s) => (value = s.value));
    return value;
  }

  it('passes values through unchanged when no clamp is configured', () => {
    service.set({ value: new Rgba(0, 255, 0, 0.5), origin: 'sliders' });
    expect(latestValue()).toEqual(new Rgba(0, 255, 0, 0.5));
  });

  describe('GH #113 lockValues.clamp', () => {
    it('forces the locked alpha onto incoming colors when clamp is true', () => {
      service.configuration = new Configuration({
        lockValues: { alpha: 1, clamp: true },
      });
      service.set({ value: new Rgba(0, 255, 0, 0.5), origin: 'sliders' });
      const value = latestValue() as Rgba;
      expect(value.a).toBe(1);
    });

    it('forces every locked channel, not just alpha', () => {
      service.configuration = new Configuration({
        lockValues: { hue: 0, saturation: 1, brightness: 1, clamp: true },
      });
      service.set({ value: new Rgba(0, 0, 255, 1), origin: 'sliders' });
      const value = latestValue() as Rgba;
      expect(value.toRounded(0, 0, 0, 2)).toEqual(new Rgba(255, 0, 0, 1));
    });

    it('leaves the alpha untouched when clamp is false (default)', () => {
      service.configuration = new Configuration({
        lockValues: { alpha: 1 },
      });
      service.set({ value: new Rgba(0, 255, 0, 0.5), origin: 'sliders' });
      const value = latestValue() as Rgba;
      expect(value.a).toBe(0.5);
    });

    it('also clamps temp values', () => {
      service.configuration = new Configuration({
        lockValues: { alpha: 1, clamp: true },
      });
      service.setTemp({ value: new Rgba(0, 255, 0, 0.5), origin: 'sliders' });
      let value: Rgba | null | undefined;
      service.temp.pipe(take(1)).subscribe((s) => (value = s.value));
      expect((value as Rgba).a).toBe(1);
    });

    it('ignores clamp for null values', () => {
      service.configuration = new Configuration({
        lockValues: { alpha: 1, clamp: true },
      });
      service.set({ value: null, origin: 'state' });
      expect(latestValue()).toBeNull();
    });
  });
});
