import { AbstractControl } from '@angular/forms';
import { colorValidator } from './color-validator';

const validate = colorValidator();
const check = (value: string | null | undefined) =>
  validate({ value } as AbstractControl);

const VALID_CASES: string[] = [
  '#fff',
  '#FFF',
  '#ffff',
  '#ffffff',
  '#FFFFFF',
  '#AbCdEf',
  '#abcdef80',
  '#ffffffff',
  '  #fff  ',
  'rgb(0, 0, 0)',
  'rgb(255,255,255)',
  'rgb( 12 , 34 , 56 )',
  'RGB(255, 0, 0)',
  'rgb(255, 0, 0, 0.5)',
  'rgba(255, 0, 0, 1)',
  'rgba(255, 0, 0, 0)',
  'rgba(255, 0, 0, 0.5)',
  'rgba(255, 0, 0, .5)',
  'rgba(255,0,0,50%)',
  'rgba(255, 0, 0, 100%)',
  'hsl(0, 0%, 100%)',
  'hsl(360, 100%, 50%)',
  'hsl(120,50%,50%)',
  'HSL(120, 50%, 50%)',
  'hsla(120, 50%, 50%, 0.5)',
  'hsla(120, 50%, 50%, .5)',
  'hsla(120,50%,50%,50%)',
  'hsv(0, 0%, 100%)',
  'hsv(300,100%,100%)',
  'HSV(300, 100%, 100%)',
  'hsva(300, 100%, 100%, 0.5)',
  'hsva(300, 100%, 100%, 50%)',
  'cmyk(0%, 100%, 0%, 0%)',
  'cmyk(0, 100, 0, 0)',
  'cmyk(24.77%, 0%, 99.1%, 12.94%)',
  'CMYK(0, 0, 0, 100)',
  'cmyk( 0 , 100 , 0 , 0 )',
];

const INVALID_CASES: string[] = [
  '#ff',
  '#fffff',
  '#ggg',
  '#ff00f',
  'fff',
  'ffffff',
  '123456',
  'red',
  'foo #fff',
  '#fff bar',
  'xxrgb(0, 0, 0)',
  'rgb(0, 0, 0)yy',
  'rgb(0, 0)',
  'rgb(0, 0, 0, 0, 0)',
  'rgb(a, b, c)',
  'rgb(25.5, 0, 0)',
  'rgb(300, 0, 0)',
  'rgb(999, 999, 999)',
  'rgba(0, 0, 0, 1.5)',
  'rgba(0, 0, 0, 150%)',
  'hsl(120, 50, 50)',
  'hsl(400, 50%, 50%)',
  'hsl(120, 150%, 50%)',
  'hsl(120, 50%, 150%)',
  'hsla(120, 50%, 50%, 1.5)',
  'hsv(120, 50, 50)',
  'hsv(400, 50%, 50%)',
  'hsv(120, 50%, 150%)',
  'hsva(120, 50%, 50%, 1.5)',
  'cmyk(0, 0, 0)',
  'cmyk(150%, 0%, 0%, 0%)',
  'cmyk(0, 0, 0, 101)',
];

describe('colorValidator', () => {
  it('accepts empty values, leaving required-ness to Validators.required', () => {
    expect(check('')).toBeNull();
    expect(check(null)).toBeNull();
    expect(check(undefined)).toBeNull();
  });

  VALID_CASES.forEach((value) => {
    it(`accepts "${value}"`, () => {
      expect(check(value)).toBeNull();
    });
  });

  INVALID_CASES.forEach((value) => {
    it(`rejects "${value}"`, () => {
      expect(check(value)).toEqual({ invalidColor: true });
    });
  });
});

describe('colorValidator GH #126 (HSL/CMYK v3 wrongly rejected)', () => {
  const cases = [
    'hsl(210, 10%, 20%)',
    'hsl(120, 10%, 40%)',
    'hsla(200, 30%, 60%, 0.5)',
    'cmyk(10%, 20%, 30%, 40%)',
    'cmyk(10, 20, 30, 40)',
  ];
  cases.forEach((value) => {
    it(`accepts "${value}"`, () => {
      expect(check(value)).toBeNull();
    });
  });
});
