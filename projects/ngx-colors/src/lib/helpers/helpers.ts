import { ColorFormats } from '../enums/formats';


export function isDescendantOrSame(nodeParent: any, nodeTarget: any): boolean {
  return nodeParent == nodeTarget || Array.from(nodeParent.childNodes).some(c => isDescendantOrSame(c,nodeTarget))

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
