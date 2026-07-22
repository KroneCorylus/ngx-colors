import { Rgba } from '../models/rgba';
export type InputOrigins = 'sliders' | 'palette' | 'text';
export type Changes = {
  value: Rgba | null | undefined;
  origin: InputOrigins | 'state' | 'confirm' | 'cancel';
};
export function isInputOrigin(origin: string): origin is InputOrigins {
  return ['sliders', 'palette', 'text'].includes(origin);
}
