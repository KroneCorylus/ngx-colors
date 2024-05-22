import { Convert } from './convert';
import { ColorFormats } from '../enums/color-formats';
import { Hsva } from '../models/hsva';
import { Rgba } from '../models/rgba';
import { Hsla } from '../models/hsla';
import { Cmyk } from '../models/cmyk';
import { ColorFormat } from '../interfaces/color-format';

export type ColorEquivalence = {
  [x: string]: string | Array<string>;
};

const iterateTests = (
  keys: Array<string>,
  convertTo: string,
  colorFormat: ColorFormats
) => {
  for (let i = 0; i < mockStrings.length; i++) {
    const test = mockStrings[i];
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
        const result = Convert.stringToFormatString(originalValue, colorFormat);
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
const mockClases: Array<{ [x: string]: ColorFormat | string }> = [
  {
    rgba: new Rgba(255, 255, 255, 1),
    hsla: new Hsla(0, 0, 1, 1),
    hsva: new Hsva(0, 0, 1, 1),
    cmyk: new Cmyk(0, 0, 0, 0, 1),
  },
  {
    rgba: new Rgba(255, 255, 255, 0),
    hsla: new Hsla(0, 0, 1, 0),
    hsva: new Hsva(0, 0, 1, 0),
    cmyk: new Cmyk(0, 0, 0, 0, 0),
  },
  {
    rgba: new Rgba(0, 255, 0, 1),
    hsla: new Hsla(120, 1, 0.5, 1),
    hsva: new Hsva(120, 1, 1, 1),
    cmyk: new Cmyk(1, 0, 1, 0, 1),
  },
  {
    rgba: new Rgba(0, 0, 255, 1),
    hsla: new Hsla(240, 1, 0.5, 1),
    hsva: new Hsva(240, 1, 1, 1),
    cmyk: new Cmyk(1, 1, 0, 0, 1),
  },
  {
    rgba: new Rgba(255, 0, 255, 1),
    hsla: new Hsla(300, 1, 0.5, 1),
    hsva: new Hsva(300, 1, 1, 1),
    cmyk: new Cmyk(0, 1, 0, 0, 1),
  },
  {
    rgba: new Rgba(255, 100, 0, 0.5),
    hsla: new Hsla(23.53, 1, 0.5, 0.5),
    hsva: new Hsva(23.53, 1, 1, 0.5),
    cmyk: new Cmyk(0, 0.6078, 1, 0, 0.5),
  },
  {
    rgba: new Rgba(214, 87, 62, 0.96),
    hsla: new Hsla(9.87, 0.6496, 0.5412, 0.96),
    hsva: new Hsva(9.87, 0.7103, 0.8392, 0.96),
    cmyk: new Cmyk(0, 0.5935, 0.7103, 0.1608, 0.96),
  },
];

const mockStrings: Array<ColorEquivalence> = [
  {
    hex: '#ffffff',
    rgba: 'rgb(255, 255, 255)',
    hsla: 'hsl(0, 0%, 100%)',
    hsva: 'hsv(0, 0%, 100%)',
    cmyk: 'cmyk(0%, 0%, 0%, 0%)',
  },
  {
    hex: '#000000',
    rgba: 'rgb(0, 0, 0)',
    hsla: 'hsl(0, 0%, 0%)',
    hsva: 'hsv(0, 0%, 0%)',
    cmyk: 'cmyk(0%, 0%, 0%, 100%)',
  },
  {
    hex: '#ffffff00',
    rgba: 'rgba(255, 255, 255, 0.0)',
    hsla: 'hsla(0, 0%, 100%, 0.0)',
    hsva: 'hsva(0, 0%, 100%, 0)',
    cmyk: '',
  },
  {
    hex: '#ff00ff',
    rgba: 'rgb(255, 0, 255)',
    hsla: 'hsl(300, 100%, 50%)',
    hsva: 'hsv(300, 100%, 100%)',
    cmyk: 'cmyk(0%, 100%, 0%, 0%)',
  },
  {
    hex: ['#ff640080', '#ff660080'],
    rgba: ['rgba(255, 100, 0, 0.50)', 'rgba(255, 102, 0, 0.50)'],
    hsla: 'hsla(24, 100%, 50%, 0.50)',
    hsva: 'hsva(24, 100%, 100%, 0.5)',
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
    rgba: 'rgb(167, 222, 2)',
    hsla: 'hsl(75, 98%, 44%)',
    hsva: 'hsv(75, 99%, 87%)',
    cmyk: ['cmyk(24.77%, 0%, 99.1%, 12.94%)', 'cmyk(24.75%, 0%, 99%, 13%)'],
  },
];

function getKeyByColorFormat(cf: ColorFormats) {
  switch (cf) {
    case ColorFormats.HSVA:
      return 'hsva';
    case ColorFormats.CMYK:
      return 'cmyk';
    case ColorFormats.HSLA:
      return 'hsla';
    case ColorFormats.HEX:
      return 'hex';
    case ColorFormats.RGBA:
      return 'rgba';
  }
}

const isColorFormat = (value: any): value is ColorFormat => !!value?.toRounded;

function testFormatToClass(source: ColorFormats, target: ColorFormats) {
  const keysource = getKeyByColorFormat(source);
  const keytarget = getKeyByColorFormat(target);
  for (let i = 0; i < mockClases.length; i++) {
    const test = mockClases[i];
    const source: ColorFormat | string = test[keysource];
    const spectedResult: ColorFormat | string = test[keytarget];
    let result: ColorFormat | string = Convert.colorToFormat(source, target);
    if (isColorFormat(result)) {
      result = result.toRounded();
    }
    it(`CMYK: ${source.toString()} to HSVA ${spectedResult.toString()}`, () => {
      expect(result).toEqual(spectedResult);
    });
  }
}

describe('Convert string to RGB string', () => {
  const keys: Array<string> = ['hex', 'hsla', 'cmyk', 'hsva'];
  const convertTo: string = 'rgba';
  iterateTests(keys, convertTo, ColorFormats.RGBA);
});

describe('Convert string to HEX string', () => {
  const keys = ['rgba', 'hsla', 'cmyk', 'hsva'];
  const convertTo = 'hex';
  iterateTests(keys, convertTo, ColorFormats.HEX);
});

describe('Convert string to CYMK string', () => {
  const keys = ['rgba', 'hsla', 'hex', 'hsva'];
  const convertTo = 'cmyk';
  iterateTests(keys, convertTo, ColorFormats.CMYK);
});

describe('Convert string to CYMK string', () => {
  const keys = ['rgba', 'hsla', 'hex', 'hsva'];
  const convertTo = 'hsva';
  iterateTests(keys, convertTo, ColorFormats.HSVA);
});
// FROM ANY TO RGBA
describe('Convert Class HSVA to Class RGBA', () => {
  testFormatToClass(ColorFormats.HSVA, ColorFormats.RGBA);
});
describe('Convert Class CMYK to Class RGBA', () => {
  testFormatToClass(ColorFormats.CMYK, ColorFormats.RGBA);
});
describe('Convert Class HSLA to Class RGBA', () => {
  testFormatToClass(ColorFormats.HSLA, ColorFormats.RGBA);
});
//--missing hex tests

//FROM RGBA TO ANY
describe('Convert Class RGBA to Class HSVA', () => {
  testFormatToClass(ColorFormats.RGBA, ColorFormats.HSVA);
});
describe('Convert Class RGBA to Class CMYK', () => {
  testFormatToClass(ColorFormats.RGBA, ColorFormats.CMYK);
});
describe('Convert Class RGBA to Class HSLA', () => {
  testFormatToClass(ColorFormats.RGBA, ColorFormats.HSLA);
});
