import { ColorOption } from '../types/color-option';

const REMOVED_ATTRIBUTES: Record<string, string> = {
  'ngx-colors-trigger': 'ngxColorsTrigger',
  colorsAnimation: 'animation="slide" or animation="popup"',
  format: 'outputModel and allowedModels (for example, HEXA instead of hex)',
  formats: 'allowedModels with uppercase color models',
  hideTextInput: '[display]="{ text: false }"',
  hideColorPicker: '[display]="{ sliders: false }"',
  attachTo: 'overlayAttachTo',
  overlayClassName: 'overlayClass',
  acceptLabel: '[labels]="{ accept: ... }"',
  cancelLabel: '[labels]="{ cancel: ... }"',
  colorPickerControls: 'lockValues and layout',
};

export function assertModernTrigger(element: HTMLElement): void {
  for (const [attribute, replacement] of Object.entries(REMOVED_ATTRIBUTES)) {
    if (element.hasAttribute(attribute)) {
      throw new Error(
        `ngx-colors: "${attribute}" was removed in v5. Use ${replacement}. See MIGRATION.md.`,
      );
    }
  }
}

export function assertModernPalette(
  options: unknown,
  path = 'palette',
): asserts options is ColorOption[] {
  if (!Array.isArray(options)) {
    throw new Error(
      `ngx-colors: ${path} must be an array of ColorOption items.`,
    );
  }
  options.forEach((option: unknown, index) => {
    const itemPath = `${path}[${index}]`;
    if (typeof option === 'string' || option === undefined) return;
    if (option && typeof option === 'object') {
      if ('preview' in option || 'variants' in option) {
        throw new Error(
          `ngx-colors: ${itemPath} uses the v3 palette API, removed in v5. Replace preview with color, variants with childs, and the old color label with name.`,
        );
      }
      if (
        'color' in option &&
        (option.color === undefined || typeof option.color === 'string')
      ) {
        if ('childs' in option && option.childs !== undefined) {
          assertModernPalette(option.childs, `${itemPath}.childs`);
        }
        return;
      }
    }
    throw new Error(
      `ngx-colors: ${itemPath} must be a color string, undefined, or { color, childs?, name? }.`,
    );
  });
}
