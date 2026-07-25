export function round(num: number, decimalPlaces: number = 0) {
  num = Math.round(Number(num + 'e' + decimalPlaces));
  return Number(num + 'e' + -decimalPlaces);
}
