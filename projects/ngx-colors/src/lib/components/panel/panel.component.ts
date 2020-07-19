import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, HostListener, HostBinding } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';
import { isDescendantOrSame } from '../../helpers/helpers';
import { ColorFormats } from '../../enums/formats';
import { ConverterService } from '../../services/converter.service';
import { defaultColors } from '../../helpers/default-colors';
import { formats } from '../../helpers/formats';
import { NgxColorsTriggerDirective } from '../../directives/ngx-colors-trigger.directive';
import { Hsva } from '../../clases/formats';




@Component({
  selector: 'ngx-colors-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  animations: [
    trigger('colorsAnimation', [
      transition('void => slide-in', [
        // Initially all colors are hidden
        query(':enter', style({ opacity: 0 }), { optional: true }),
        //slide-in animation
        query(':enter', stagger('10ms', [
          animate('.3s ease-in', keyframes([
            style({ opacity: 0, transform: 'translatex(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translatex(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translatex(0)', offset: 1 }),
          ]))]), { optional: true }),
      ]),
      //popup animation
      transition('void => popup', [
        query(':enter', style({ opacity: 0,transform: 'scale(0)' }), { optional: true }),
        query(':enter', stagger('10ms', [
          animate('500ms ease-out', keyframes([
            style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
            style({ opacity: 1, transform: 'scale(1.1)', offset: 0.8 }),
            style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
          ]))]), { optional: true })
      ])
    ]),
    
  ]
})
export class PanelComponent implements OnInit {

  @HostListener('document:click', ['$event'])
  click(event) {
    if(this.isOutside(event)) {
      this.emitClose();
    } 
  }

  @HostListener('document:scroll')
  onScroll(){
    this.setPosition()
  }
  @HostListener('window:resize')
  onResize(){
    this.setPosition()
  }

  @HostBinding('style.top.px') public top: number;
  @HostBinding('style.left.px') public left: number;

  constructor(
    public service:ConverterService
  )
  {

  }

  public color = '#000000';
  public previewColor: string = '#000000';
  public hsva = new Hsva(0,1,1,1)

  public colorsAnimationEffect = 'slide-in'

  public palette = defaultColors;
  public variants = [];

  public colorFormats = formats;
  public format:ColorFormats = ColorFormats.HEX;
 
    
  public menu = 1;
 

  private triggerInstance:NgxColorsTriggerDirective;
  private triggerElementRef;
  



  public ngOnInit(){
    this.setPosition();
    this.hsva = this.service.stringToHsva(this.color);
  }


  public iniciate(triggerInstance:NgxColorsTriggerDirective,triggerElementRef,color,palette,animation){
      this.triggerInstance = triggerInstance;
      this.triggerElementRef = triggerElementRef;
      this.color = color;
      this.previewColor = this.color;
      this.palette = palette ?? defaultColors;
      this.colorsAnimationEffect = animation;
  }

  public setPosition() {
    if(this.triggerElementRef){
      var viewportOffset = this.triggerElementRef.nativeElement.getBoundingClientRect();
      this.top = viewportOffset.top + viewportOffset.height;
      this.left = viewportOffset.left + 250 > window.innerWidth ? viewportOffset.right - 250 : viewportOffset.left;
    }
  }
  public hasVariant(color):boolean{
    return typeof color != 'string' && color.variants.some(v => v.toUpperCase() == this.previewColor.toUpperCase() );
  }

  public isSelected(color){
    return typeof color == 'string' && color.toUpperCase() == this.previewColor.toUpperCase();
  }

  public getBackgroundColor(color){
    if(typeof color == 'string'){
      return { 'background': color };
    }
    else{
      return { 'background': color.preview };
    }
  }


  /**
   * Change color from default colors
   * @param string color
   */
  public changeColor(color: string): void {
    this.setColor(this.service.stringToHsva(color));
    // this.triggerInstance.onChange();
    this.emitClose();
  }

  public onChangeColorPicker(event:Hsva) {
    this.setColor(event);
    // this.triggerInstance.onChange();
  }

  public changeColorManual(color: string): void {
      this.previewColor = color;
      this.color = color;
      this.hsva = this.service.stringToHsva(color);
      this.triggerInstance.setColor(this.color);
      // this.triggerInstance.onChange();
  }

  setColor(value:Hsva){
    this.hsva = value;
    this.color = this.service.toFormat(value,this.format);
    this.setPreviewColor(value);
    this.triggerInstance.setColor(this.color);
  }


  setPreviewColor(value:Hsva){
    this.previewColor = this.service.hsvaToRgba(value).toString();
  }

  onChange(){
    // this.triggerInstance.onChange();
  }
  
  public showColors(){
    this.menu = 1;
  }

  public onColorClick(color){
    if(typeof color == 'string'){
      this.changeColor(color);
    }
    else{
      this.variants = color.variants;
      this.menu = 2;
    }
  }

  public addColor(){
    this.menu = 3;
  }

  public nextFormat(){
    this.format = (this.format + 1) % this.colorFormats.length;
    this.setColor(this.hsva);
  }


  public emitClose(){
    this.triggerInstance.close();
  }

 

  isOutside(event){
        return event.target.classList.contains('ngx-colors-overlay');
  }

  


}
