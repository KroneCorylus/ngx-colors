export type DisplayOptions = {
  text?: boolean;
  sliders?: boolean;
  palette?: boolean;
};

export type LayoutOptions = 'full-vertical' | 'full-horizontal' | 'pages';
export type LockValuesOptions = {
  hue?: number | undefined;
  saturation?: number | undefined;
  brightness?: number | undefined;
  alpha?: number | undefined;
};
export type ConfirmationRequiredOptions = {
  palette: boolean;
  text: boolean;
  sliders: boolean;
};
export type AnimationOptions = 'popup' | 'slide';
