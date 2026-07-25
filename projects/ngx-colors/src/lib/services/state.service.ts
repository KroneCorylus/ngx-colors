import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rgba } from '../models/rgba';
import { Hsva } from '../models/hsva';
import { ColorHelper } from '../utility/color-helper';
import { ColorOption } from '../types/color-option';
import { Configuration } from '../models/configuration';
import { ColorModel } from '../types/color-model';
import { Changes } from '../types/changes';

@Injectable()
export class StateService {
  private _state = new BehaviorSubject<Changes>({
    value: null,
    origin: 'state',
  });
  public state = this._state.asObservable();

  private _temp = new BehaviorSubject<Changes>({
    value: null,
    origin: 'state',
  });
  public temp = this._temp.asObservable();

  constructor() {}

  public setTemp(value: Changes) {
    return this._temp.next(this.clamp(value));
  }

  public set(value: Changes) {
    return this._state.next(this.clamp(value));
  }

  private clamp(change: Changes): Changes {
    const lock = this.configuration.lockValues;
    if (!lock?.clamp || !(change.value instanceof Rgba)) {
      return change;
    }
    const hsva: Hsva = ColorHelper.rgba2Hsva(change.value);
    if (lock.hue !== undefined) {
      hsva.h = lock.hue;
    }
    if (lock.saturation !== undefined) {
      hsva.s = lock.saturation;
    }
    if (lock.brightness !== undefined) {
      hsva.v = lock.brightness;
    }
    if (lock.alpha !== undefined) {
      hsva.a = lock.alpha;
    }
    return { ...change, value: ColorHelper.hsva2Rgba(hsva) };
  }
  public palette$: Observable<ColorOption[]> | undefined = undefined;

  public sliderChange$: EventEmitter<Rgba | null> =
    new EventEmitter<Rgba | null>();
  public paletteColorHover$: EventEmitter<Rgba | null> =
    new EventEmitter<Rgba | null>();
  public configuration: Configuration = new Configuration();
  public colorModel: ColorModel = 'RGBA';
}
