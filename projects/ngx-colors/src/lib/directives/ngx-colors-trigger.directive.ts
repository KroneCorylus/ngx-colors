import {
  EventEmitter,
  Input,
  Output,
  Directive,
  ElementRef,
  ComponentRef,
  HostListener,
  forwardRef,
  OnDestroy,
} from '@angular/core';
import { PanelFactoryService } from '../services/panel-factory.service';
import { PanelComponent } from '../components/panel/panel.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxColorsColor } from '../clases/color';
import { ConverterService } from '../services/converter.service';
import { formats } from '../helpers/formats';

@Directive({
  selector: '[ngx-colors-trigger]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxColorsTriggerDirective),
      multi: true,
    },
  ],
})
export class NgxColorsTriggerDirective
  implements ControlValueAccessor, OnDestroy
{
  //Main input/output of the color picker
  // @Input() color = '#000000';
  // @Output() colorChange:EventEmitter<string> = new EventEmitter<string>();

  color = '';

  //This defines the type of animation for the palatte.(slide-in | popup)
  @Input() colorsAnimation: 'slide-in' | 'popup' = 'slide-in';

  //This is used to set a custom palette of colors in the panel;
  @Input() palette: Array<string> | Array<NgxColorsColor>;

  @Input() format: string;
  @Input() position: 'top' | 'bottom' = 'bottom';
  @Input() hideTextInput: boolean;
  @Input() hideColorPicker: boolean;
  @Input() attachTo: string | undefined = undefined;
  @Input() overlayClassName: string | undefined = undefined;
  @Input() colorPickerControls: 'default' | 'only-alpha' | 'no-alpha' =
    'default';
  @Input() acceptLabel: string = 'ACCEPT';
  @Input() cancelLabel: string = 'CANCEL';
  // This event is trigger every time the selected color change
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  // This event is trigger every time the user change the color using the panel
  @Output() input: EventEmitter<string> = new EventEmitter<string>();
  // This event is trigger every time the user change the color using the panel
  @Output() slider: EventEmitter<string> = new EventEmitter<string>();
  @Output() close: EventEmitter<string> = new EventEmitter<string>();
  @Output() open: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click') onClick() {
    this.openPanel();
  }
  constructor(
    private triggerRef: ElementRef,
    private panelFactory: PanelFactoryService,
    private service: ConverterService
  ) {}

  panelRef: ComponentRef<PanelComponent>;
  isDisabled: boolean = false;

  onTouchedCallback: () => void = () => {};
  onChangeCallback: (_: any) => void = () => {};

  public ngOnDestroy(): void {
    if (this.panelRef) {
      this.panelFactory.removePanel();
    }
  }

  public openPanel() {
    if (!this.isDisabled) {
      this.panelRef = this.panelFactory.createPanel(
        this.attachTo,
        this.overlayClassName
      );
      this.panelRef.instance.iniciate(
        this,
        this.triggerRef,
        this.color,
        this.palette,
        this.colorsAnimation,
        this.format,
        this.hideTextInput,
        this.hideColorPicker,
        this.acceptLabel,
        this.cancelLabel,
        this.colorPickerControls,
        this.position
      );
    }
    this.open.emit(this.color);
  }

  public closePanel() {
    this.panelFactory.removePanel();
    this.onTouchedCallback();
    this.close.emit(this.color);
  }

  public onChange() {
    this.onChangeCallback(this.color);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.triggerRef.nativeElement.style.opacity = isDisabled ? 0.5 : 1;
  }

  public setColor(color) {
    this.writeValue(color);
    this.input.emit(color);
  }

  public sliderChange(color) {
    this.slider.emit(color);
  }

  get value(): string {
    return this.color;
  }

  set value(value: string) {
    this.setColor(value);
    this.onChangeCallback(value);
  }

  writeValue(value) {
    if (value !== this.color) {
      if (this.format) {
        let format = formats.indexOf(this.format.toLowerCase());
        value = this.service.stringToFormat(value, format);
      }
      this.color = value;
      this.onChange();
      this.change.emit(value);
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
