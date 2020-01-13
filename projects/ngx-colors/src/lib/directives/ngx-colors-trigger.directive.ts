import { EventEmitter,Input, Output, Directive, ElementRef, OnDestroy, OnChanges, OnInit, ComponentRef, HostListener } from '@angular/core';
import { PanelFactoryService } from '../services/panel-factory.service';
import { PanelComponent } from '../components/panel/panel.component';

@Directive({
  selector: '[ngx-colors-trigger]'
})
export class NgxColorsTriggerDirective{


  //Main input/output of the color picker
  @Input() color = '#000000';
  @Output() colorChange:EventEmitter<string> = new EventEmitter<string>();

  //This defines the type of animation for the palatte.(slide-in | popup)
  @Input() colorsAnimation;

  //This is used to set a custom palette of colors in the panel;
  @Input() customColors;

  //This event is trigger every time a change is made using the panen
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


  open(){
    this.panelRef = this.panelFactory.createPanel();
    this.panelRef.instance.iniciate(this,this.triggerRef,this.color,this.customColors);
  }

  public close(){
    this.panelFactory.removePanel();
  }

  public onChange(){
    this.change.emit(this.color);
  }


  public setColor(color){
    this.color = color;
    this.colorChange.emit(this.color);
  }

}
