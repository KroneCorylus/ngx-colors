import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { Rgba } from '../models/rgba';
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
    return this._temp.next(value);
  }

  public set(value: Changes) {
    return this._state.next(value);
  }
  public palette$: Observable<ColorOption[]> | undefined = undefined;

  public sliderChange$: EventEmitter<Rgba | null> =
    new EventEmitter<Rgba | null>();
  public paleteColorHover$: EventEmitter<Rgba | null> =
    new EventEmitter<Rgba | null>();
  public configuration: Configuration = new Configuration();
  public colorModel: ColorModel = 'RGBA';
}
