export class NgxColorsColor {
  preview: string;
  variants: Array<string>;
  constructor(params?) {
    if (params) {
      this.preview = params.preview;
      this.variants = params.variants;
    }
  }
}
