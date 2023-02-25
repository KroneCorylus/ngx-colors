import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  HostBinding,
} from "@angular/core";
import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
  keyframes,
} from "@angular/animations";
import { isDescendantOrSame } from "../../helpers/helpers";
import { ColorFormats } from "../../enums/formats";
import { ConverterService } from "../../services/converter.service";
import { defaultColors } from "../../helpers/default-colors";
import { formats } from "../../helpers/formats";
import { NgxColorsTriggerDirective } from "../../directives/ngx-colors-trigger.directive";
import { Hsva } from "../../clases/formats";
import { NgxColor } from "../../clases/color";

@Component({
  selector: "ngx-colors-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.scss"],
  animations: [
    trigger("colorsAnimation", [
      transition("void => slide-in", [
        // Initially all colors are hidden
        query(":enter", style({ opacity: 0 }), { optional: true }),
        //slide-in animation
        query(
          ":enter",
          stagger("10ms", [
            animate(
              ".3s ease-in",
              keyframes([
                style({ opacity: 0, transform: "translatex(-50%)", offset: 0 }),
                style({
                  opacity: 0.5,
                  transform: "translatex(-10px) scale(1.1)",
                  offset: 0.3,
                }),
                style({ opacity: 1, transform: "translatex(0)", offset: 1 }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
      //popup animation
      transition("void => popup", [
        query(":enter", style({ opacity: 0, transform: "scale(0)" }), {
          optional: true,
        }),
        query(
          ":enter",
          stagger("10ms", [
            animate(
              "500ms ease-out",
              keyframes([
                style({ opacity: 0.5, transform: "scale(.5)", offset: 0.3 }),
                style({ opacity: 1, transform: "scale(1.1)", offset: 0.8 }),
                style({ opacity: 1, transform: "scale(1)", offset: 1 }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class PanelComponent implements OnInit {
  @HostListener("document:mousedown", ["$event"])
  click(event) {
    if (this.isOutside(event)) {
      this.emitClose("cancel");
    }
  }

  @HostListener("document:scroll")
  onScroll() {
    this.onScreenMovement();
  }
  @HostListener("window:resize")
  onResize() {
    this.onScreenMovement();
  }

  @HostBinding("style.top.px") public top: number;
  @HostBinding("style.left.px") public left: number;
  @ViewChild("dialog") panelRef: ElementRef;
  constructor(
    public service: ConverterService,
    private cdr: ChangeDetectorRef
  ) {}

  public color = "#000000";
  public previewColor: string = "#000000";
  public hsva = new Hsva(0, 1, 1, 1);

  public colorsAnimationEffect = "slide-in";

  public palette = defaultColors;
  public variants = [];

  public colorFormats = formats;
  public format: ColorFormats = ColorFormats.HEX;

  public canChangeFormat: boolean = true;

  public menu = 1;

  public hideColorPicker: boolean = false;
  public hideTextInput: boolean = false;
  public acceptLabel: string;
  public cancelLabel: string;
  public colorPickerControls: "default" | "only-alpha" | "no-alpha" = "default";
  private triggerInstance: NgxColorsTriggerDirective;
  private TriggerBBox;
  public isSelectedColorInPalette: boolean;
  public indexSeleccionado;
  public positionString;
  public temporalColor;
  public backupColor;

  public ngOnInit() {
    this.setPosition();
    this.hsva = this.service.stringToHsva(this.color);
    this.indexSeleccionado = this.findIndexSelectedColor(this.palette);
  }
  public ngAfterViewInit() {
    this.setPositionY();
  }

  private onScreenMovement() {
    this.setPosition();
    this.setPositionY();
    if (!this.panelRef.nativeElement.style.transition) {
      this.panelRef.nativeElement.style.transition = "transform 0.5s ease-out";
    }
  }

  private findIndexSelectedColor(colors): number {
    let resultIndex = undefined;
    if (this.color) {
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        if (typeof color == "string") {
          if (
            this.service.stringToFormat(this.color, ColorFormats.HEX) ==
            this.service.stringToFormat(color, ColorFormats.HEX)
          ) {
            resultIndex = i;
          }
        } else if (color === undefined) {
          this.color = undefined;
        } else {
          if (this.findIndexSelectedColor(color.variants) != undefined) {
            resultIndex = i;
          }
        }
      }
    }
    return resultIndex;
  }

  public iniciate(
    triggerInstance: NgxColorsTriggerDirective,
    triggerElementRef,
    color,
    palette,
    animation,
    format: string,
    hideTextInput: boolean,
    hideColorPicker: boolean,
    acceptLabel: string,
    cancelLabel: string,
    colorPickerControls: "default" | "only-alpha" | "no-alpha",
    position: "top" | "bottom"
  ) {
    this.colorPickerControls = colorPickerControls;
    this.triggerInstance = triggerInstance;
    this.TriggerBBox = triggerElementRef;
    this.color = color;
    this.hideColorPicker = hideColorPicker;
    this.hideTextInput = hideTextInput;
    this.acceptLabel = acceptLabel;
    this.cancelLabel = cancelLabel;
    if (format) {
      if (formats.includes(format)) {
        this.format = formats.indexOf(format.toLowerCase());
        this.canChangeFormat = false;
        if (
          this.service.getFormatByString(this.color) != format.toLowerCase()
        ) {
          this.setColor(this.service.stringToHsva(this.color));
        }
      } else {
        console.error("Format provided is invalid, using HEX");
        this.format = ColorFormats.HEX;
      }
    } else {
      this.format = formats.indexOf(this.service.getFormatByString(this.color));
    }

    this.previewColor = this.color;
    this.palette = palette ?? defaultColors;
    this.colorsAnimationEffect = animation;
    if (position == "top") {
      let TriggerBBox = this.TriggerBBox.nativeElement.getBoundingClientRect();
      this.positionString =
        "transform: translateY(calc( -100% - " + TriggerBBox.height + "px ))";
    }
  }

  public setPosition(): void {
    if (this.TriggerBBox) {
      const panelWidth = 250;
      const viewportOffset =
        this.TriggerBBox.nativeElement.getBoundingClientRect();
      this.top = viewportOffset.top + viewportOffset.height;
      if (viewportOffset.left + panelWidth > window.innerWidth) {
        this.left =
          viewportOffset.right < panelWidth
            ? window.innerWidth / 2 - panelWidth / 2
            : viewportOffset.right - panelWidth;
      } else {
        this.left = viewportOffset.left;
      }
    }
  }

  private setPositionY(): void {
    const triggerBBox = this.TriggerBBox.nativeElement.getBoundingClientRect();
    const panelBBox = this.panelRef.nativeElement.getBoundingClientRect();
    const panelHeight = panelBBox.height;
    // Check for space below the trigger
    if (triggerBBox.bottom + panelHeight > window.innerHeight) {
      // there is no space, move panel over the trigger
      this.positionString =
        triggerBBox.top < panelBBox.height
          ? "transform: translateY(-" + triggerBBox.bottom + "px );"
          : "transform: translateY(calc( -100% - " +
            triggerBBox.height +
            "px ));";
    } else {
      this.positionString = "";
    }
    this.cdr.detectChanges();
  }

  public hasVariant(color): boolean {
    if (!this.previewColor) {
      return false;
    }
    return (
      typeof color != "string" &&
      color.variants.some(
        (v) => v.toUpperCase() == this.previewColor.toUpperCase()
      )
    );
  }

  public isSelected(color) {
    if (!this.previewColor) {
      return false;
    }
    return (
      typeof color == "string" &&
      color.toUpperCase() == this.previewColor.toUpperCase()
    );
  }

  public getBackgroundColor(color) {
    if (typeof color == "string") {
      return { background: color };
    } else {
      return { background: color?.preview };
    }
  }

  public onAlphaChange(event) {
    this.palette = this.ChangeAlphaOnPalette(event, this.palette);
  }

  private ChangeAlphaOnPalette(
    alpha,
    colors: Array<string | NgxColor>
  ): Array<any> {
    var result = [];
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      if (typeof color == "string") {
        let newColor = this.service.stringToHsva(color);
        newColor.onAlphaChange(alpha);
        result.push(this.service.toFormat(newColor, this.format));
      } else {
        let newColor = new NgxColor();
        let newColorPreview = this.service.stringToHsva(color.preview);
        newColorPreview.onAlphaChange(alpha);
        newColor.preview = this.service.toFormat(newColorPreview, this.format);
        newColor.variants = this.ChangeAlphaOnPalette(alpha, color.variants);
        result.push(newColor);
      }
    }
    return result;
  }

  /**
   * Change color from default colors
   * @param string color
   */
  public changeColor(color: string): void {
    this.setColor(this.service.stringToHsva(color));
    // this.triggerInstance.onChange();
    this.emitClose("accept");
  }

  public onChangeColorPicker(event: Hsva) {
    this.temporalColor = event;
    this.color = this.service.toFormat(event, this.format);
    // this.setColor(event);
    this.triggerInstance.sliderChange(
      this.service.toFormat(event, this.format)
    );
  }

  public changeColorManual(color: string): void {
    this.previewColor = color;
    this.color = color;
    this.hsva = this.service.stringToHsva(color);
    this.temporalColor = this.hsva;
    this.triggerInstance.setColor(this.color);
    // this.triggerInstance.onChange();
  }

  setColor(value: Hsva) {
    this.hsva = value;
    this.color = this.service.toFormat(value, this.format);
    this.setPreviewColor(value);
    this.triggerInstance.setColor(this.color);
  }

  setPreviewColor(value: Hsva) {
    this.previewColor = value
      ? this.service.hsvaToRgba(value).toString()
      : undefined;
  }
  hsvaToRgba;
  onChange() {
    // this.triggerInstance.onChange();
  }

  public onColorClick(color) {
    if (typeof color == "string" || color === undefined) {
      this.changeColor(color);
    } else {
      this.variants = color.variants;
      this.menu = 2;
    }
  }

  public addColor() {
    this.menu = 3;
    this.backupColor = this.color;
    // this.color = "#FF0000";
    this.temporalColor = this.service.stringToHsva(this.color);
  }

  public nextFormat() {
    if (this.canChangeFormat) {
      this.format = (this.format + 1) % this.colorFormats.length;
      this.setColor(this.hsva);
    }
  }

  public emitClose(status: "cancel" | "accept") {
    if (this.menu == 3) {
      if (status == "cancel") {
      } else if (status == "accept") {
        this.setColor(this.temporalColor);
      }
    }
    this.triggerInstance.closePanel();
  }

  public onClickBack() {
    if (this.menu == 3) {
      this.color = this.backupColor;
      this.hsva = this.service.stringToHsva(this.color);
    }
    this.indexSeleccionado = this.findIndexSelectedColor(this.palette);
    this.menu = 1;
  }

  isOutside(event) {
    return event.target.classList.contains("ngx-colors-overlay");
  }
}
