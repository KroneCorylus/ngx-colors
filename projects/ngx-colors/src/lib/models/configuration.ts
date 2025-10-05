import { Observable } from 'rxjs';
import { NgxColorsConfiguration } from '../interfaces/configuration';
import { ColorOption } from '../types/color-option';
import {
  AnimationOptions,
  ConfirmationRequiredOptions,
  DisplayOptions,
  LayoutOptions,
  LockValuesOptions,
} from '../types/configuration';
import { defaultColors } from '../utility/default-colors';
import { ColorModel } from '../types/color-model';

export class Configuration implements NgxColorsConfiguration {
  public display: DisplayOptions = {
    text: true,
    sliders: true,
    palette: true,
  };
  public layout: LayoutOptions = 'pages';
  public lockValues: LockValuesOptions = {
    hue: undefined,
    alpha: undefined,
    brightness: undefined,
    saturation: undefined,
  };
  public outputModel: ColorModel | 'AUTO' = 'AUTO';
  public allowedModels: Array<ColorModel> = [
    'HEXA',
    'RGBA',
    'CMYK',
    'HSVA',
    'HSLA',
  ];
  public eyedropper: boolean = false;
  public palette: Observable<ColorOption[]> | ColorOption[] | undefined =
    defaultColors;
  public animation: AnimationOptions = 'popup';
  public overlayClass: string | undefined = undefined;
  public overlayAttachTo: string | HTMLElement | undefined = undefined;
  public labels: {
    accept: string;
    cancel: string;
  } = {
    accept: 'ACCEPT',
    cancel: 'CANCEL',
  };
  public confirmationRequired?: ConfirmationRequiredOptions | undefined = {
    palette: false,
    text: false,
    sliders: true,
  };

  constructor(...configOverwrites: NgxColorsConfiguration[]) {
    for (const overwrite of configOverwrites) {
      if (overwrite.display !== undefined) {
        this.display = { ...this.display, ...overwrite.display };
      }
      if (overwrite.layout !== undefined) {
        this.layout = overwrite.layout;
      }
      if (overwrite.lockValues !== undefined) {
        this.lockValues = { ...this.lockValues, ...overwrite.lockValues };
      }
      if (overwrite.outputModel !== undefined) {
        this.outputModel = overwrite.outputModel;
      }
      if (overwrite.allowedModels !== undefined) {
        this.allowedModels = overwrite.allowedModels;
      }
      if (overwrite.eyedropper !== undefined) {
        this.eyedropper = overwrite.eyedropper;
      }
      if (overwrite.palette !== undefined) {
        this.palette = overwrite.palette;
      }
      if (overwrite.animation !== undefined) {
        this.animation = overwrite.animation;
      }
      if (overwrite.overlayClass !== undefined) {
        this.overlayClass = overwrite.overlayClass;
      }
      if (overwrite.overlayAttachTo !== undefined) {
        this.overlayAttachTo = overwrite.overlayAttachTo;
      }
      if (overwrite.labels !== undefined) {
        this.labels = { ...this.labels, ...overwrite.labels };
      }
      if (overwrite.confirmationRequired !== undefined) {
        this.confirmationRequired = {
          ...this.confirmationRequired,
          ...overwrite.confirmationRequired,
        };
      }
    }
  }
}
