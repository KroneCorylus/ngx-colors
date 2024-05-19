import { Convert } from './convert';
import { ColorFormats } from '../enums/color-formats';
import { Hsva } from '../models/hsva';
import { Rgba } from '../models/rgba';
import { Hsla } from '../models/hsla';
import { Cmyk } from '../models/cmyk';

export type ColorEquivalence = {
  [x: string]: string | Array<string>;
};

let iterateTests = (
  keys: Array<string>,
  convertTo: string,
  colorFormat: ColorFormats
) => {
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    for (let j = 0; j < keys.length; j++) {
      const key: string = keys[j];

      let originalValue: string;

      if (typeof test[key] == 'string') {
        originalValue = test[key] as string;
      } else {
        originalValue = test[key][0];
      }
      if (!originalValue || !test[convertTo]) {
        break;
      }
      it(`${originalValue} -> [${test[convertTo]}]`, () => {
        let result = Convert.stringToFormat(originalValue, colorFormat);
        console.log('key:', key);
        console.log('value:', originalValue);
        console.log('expect:', test[convertTo]);
        console.log('result:', result);

        if (typeof test[convertTo] == 'string') {
          expect(result).toBe(test[convertTo]);
        } else {
          expect(test[convertTo]).toContain(result);
        }
      });
    }
  }
};
let tests: Array<ColorEquivalence> = [
  {
    hex: '#ffffff',
    rgba: 'rgb(255, 255, 255)',
    hsla: 'hsl(0, 0%, 100%)',
    hsva: 'hsl(0, 0%, 100%)',
    cmyk: 'cmyk(0, 0, 0, 0)',
  },
  {
    hex: '#ffffff00',
    rgba: 'rgba(255, 255, 255, 0.0)',
    hsla: 'hsla(0, 0%, 100%, 0.0)',
    hsva: 'hsva(0, 0%, 100%, 0.0)',
    cmyk: '',
  },
  {
    hex: '#ff00ff',
    rgba: 'rgb(255, 0, 255)',
    hsla: 'hsl(300, 100%, 50%)',
    hsva: 'hsv(300, 100%, 100%)',
    cmyk: 'cmyk(0, 100, 0, 0)',
  },
  {
    hex: ['#ff640080', '#ff660080'],
    rgba: ['rgba(255, 100, 0, 0.50)', 'rgba(255, 102, 0, 0.50)'],
    hsla: 'hsla(24, 100%, 50%, 0.50)',
    hsva: 'hsva(24, 100%, 100%, 0.50)',
    cmyk: '',
  },
  {
    hex: ['#d6573ef6', '#d6573ef5', '#d6573df5'],
    rgba: ['rgba(214, 87, 62, 0.96)', 'rgba(214, 87, 61, 0.96)'], //rounding can produce two different results. #TODO: analyze if it can be improved
    hsla: 'hsla(10, 65%, 54%, 0.96)',
    hsva: 'hsva(10, 71%, 84%, 0.96)',
    cmyk: '',
  },
  {
    hex: ['#f5c38ede', '#f5c48ede'],
    rgba: ['rgba(245, 195, 142, 0.87)', 'rgba(245, 196, 142, 0.87)'],
    hsla: 'hsla(31, 84%, 76%, 0.87)',
    hsva: 'hsva(31, 42%, 96%, 0.87)',
    cmyk: '',
  },
  {
    hex: ['#a7de02', '#a6de02'],
    rgba: ['rgb(167, 222, 2)', 'rgb(166, 222, 2)'],
    hsla: 'hsl(75, 98%, 44%)',
    hsva: 'hsv(75, 99%, 87%)',
    cmyk: 'cmyk(25, 0, 99, 13)',
  },
];

let hsvaToRgba = () => {
  for (let i = 0; i < clasesColores.length; i++) {
    const test = clasesColores[i];
    let source: Hsva = test.hsva;
    let target: Rgba = test.rgba;
    let result: Rgba = Convert.hsvaToRgba(source.toNormalized());
    it(`HSVA: ${source.toString()} to RGB ${target.toNormalized().toString()}`, () => {
      expect(result.toDenormalized()).toEqual(test.rgba);
    });
  }
};
let hsvaToHsla = () => {
  for (let i = 0; i < clasesColores.length; i++) {
    const test = clasesColores[i];
    let source: Hsva = test.hsva;
    let target: Hsla = test.hsla;
    let result: Hsla = Convert.hsva2hsla(source.toNormalized());
    it(`HSVA: ${source.toString()} to HSLA ${target.toNormalized().toString()}`, () => {
      expect(result.toDenormalized(true)).toEqual(test.hsla);
    });
  }
};
let clasesColores: Array<any> = [
  {
    rgba: new Rgba(255, 255, 255, 1),
    hsla: new Hsla(0, 0, 1, 1),
    hsva: new Hsva(0, 0, 1, 1),
    cmyk: new Cmyk(0, 0, 0, 0),
  },
  {
    rgba: new Rgba(255, 255, 255, 0),
    hsla: new Hsla(0, 0, 1, 0),
    hsva: new Hsva(0, 0, 1, 0),
    cmyk: new Cmyk(0, 0, 0, 0),
  },
  {
    rgba: new Rgba(255, 0, 255, 1),
    hsla: new Hsla(300, 1, 0.5, 1),
    hsva: new Hsva(300, 1, 1, 1),
    cmyk: new Cmyk(0, 100, 0, 0),
  },
  {
    rgba: new Rgba(255, 100, 0, 0.5),
    hsla: new Hsla(23.53, 1, 0.5, 0.5),
    hsva: new Hsva(23.53, 1, 1, 0.5),
    cmyk: new Cmyk(0, 0.6078, 100, 0),
  },
  {
    rgba: new Rgba(214, 87, 62, 0.96),
    hsla: new Hsla(9.87, 0.6496, 0.5412, 0.96),
    hsva: new Hsva(9.87, 0.7103, 0.8392, 0.96),
    cmyk: new Cmyk(0, 0.5935, 0.7103, 0.1608),
  },
];

describe('Convert string to RGB string', () => {
  let keys: Array<string> = ['hex', 'hsla', 'cmyk'];
  let convertTo: string = 'rgba';
  iterateTests(keys, convertTo, ColorFormats.RGBA);
});
describe('Convert string to HEX string', () => {
  let keys = ['rgba', 'hsla', 'cmyk'];
  let convertTo = 'hex';
  iterateTests(keys, convertTo, ColorFormats.HEX);
});

describe('Convert string to CYMK string', () => {
  let keys = ['rgba', 'hsla', 'hex'];
  let convertTo = 'cmyk';
  iterateTests(keys, convertTo, ColorFormats.CMYK);
});

fdescribe('Convert Class Hsva to Class Rgba', () => {
  hsvaToRgba();
});
fdescribe('Convert Class Hsva to Class HSLA', () => {
  hsvaToHsla();
});
