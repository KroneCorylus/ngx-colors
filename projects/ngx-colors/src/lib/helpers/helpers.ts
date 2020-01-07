import { ColorFormats } from '../enums/formats';


export function isDescendantOrSame(nodeParent: any, nodeTarget: any): boolean {
  let match = false;
  let node: any = nodeTarget;

  while (!match && node !== null) {
    if (nodeParent === node) {
      match = true
    }
    node = node.parentNode;
  }

  return match;
}
export function getFormat(format:string):ColorFormats{
  var result:ColorFormats;
  switch(format){
    case 'cmyk':
      result = ColorFormats.CMYK;
      break;
    case 'rgba':
      result = ColorFormats.RGBA;
      break;
    case 'hsla':
      result = ColorFormats.HSLA;
      break;
    case 'hex':
      result = ColorFormats.HEX;
      break;
  }
  return result;
}
