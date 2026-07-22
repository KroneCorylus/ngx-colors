import { PaletteColor } from './color';
export class PaletteStack {
  items: Array<PaletteColor[]> = [];
  peek: Array<PaletteColor> = [];
  size: number = 0;
  public pop(): Array<PaletteColor> | undefined {
    if (this.items.length <= 1) {
      return;
    }
    const removed = this.items.pop();
    this.updateState();
    return removed;
  }

  public push(item: Array<PaletteColor>) {
    this.items.push(item);
    this.updateState();
  }

  public last(): Array<PaletteColor> {
    return this.items[this.items.length - 1];
  }

  public clear(): void {
    this.items.length = 0;
    this.peek = [];
    this.size = 0;
  }

  private updateState() {
    this.peek = this.last();
    this.size = this.items.length;
  }
}
