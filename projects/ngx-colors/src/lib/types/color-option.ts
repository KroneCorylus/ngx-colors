export type ColorOption =
  | string
  | undefined
  | { color: string | undefined; childs?: Array<ColorOption>; name?: string };
