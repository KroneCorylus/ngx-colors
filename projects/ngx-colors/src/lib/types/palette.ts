import { Color } from '../models/color';

export type Palette = {
  back?: Palette;
  list: Array<Color>;
};
