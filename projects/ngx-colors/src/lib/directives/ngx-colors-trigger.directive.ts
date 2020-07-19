import { EventEmitter,Input, Output, Directive, ElementRef, ComponentRef, HostListener, forwardRef } from '@angular/core';
import { PanelFactoryService } from '../services/panel-factory.service';
import { PanelComponent } from '../components/panel/panel.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxColor } from '../clases/color';

@Directive({
  selector: '[ngx-colors-trigger]',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxColorsTriggerDirective),
      multi: true
    }
  ]
})
export class NgxColorsTriggerDirective implements ControlValueAccessor{


  //Main input/output of the color picker
  // @Input() color = '#000000';
  // @Output() colorChange:EventEmitter<string> = new EventEmitter<string>();

  color = '';


  //This defines the type of animation for the palatte.(slide-in | popup)
  @Input() colorsAnimation:'slide-in' | 'popup' = 'slide-in';

  //This is used to set a custom palette of colors in the panel;
  @Input() palette:Array<string> | Array<NgxColor>;

  @Input() format;

  // This event is trigger every time a change is made using the panen
  @Output() change:EventEmitter<string> = new EventEmitter<string>();;



  @HostListener('click') onClick(){
    this.open();
  }
  constructor(
    private triggerRef:ElementRef,
    private panelFactory:PanelFactoryService
  ) 
  {
  }

  panelRef:ComponentRef<PanelComponent>

  onTouchedCallback: () => void = () => {};
  onChangeCallback: (_: any) => void = () => {};


  open(){
    this.panelRef = this.panelFactory.createPanel();
    this.panelRef.instance.iniciate(this,this.triggerRef,this.color,this.palette,this.colorsAnimation);
  }

  public close(){
    this.panelFactory.removePanel();
  }

  public onChange(){
    this.onChangeCallback(this.color);
  }


  public setColor(color){
    this.writeValue(color);
  }

  writeValue(value){
    if(value !== this.color){
      console.log('test');
      this.color = value;
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
