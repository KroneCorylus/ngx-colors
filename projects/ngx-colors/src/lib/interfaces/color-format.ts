export interface ColorFormat {
  toString(): string;
  toDenormalized(): ColorFormat;
  toNormalized(): ColorFormat;
}
