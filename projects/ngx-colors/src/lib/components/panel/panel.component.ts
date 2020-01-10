import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';
import { isDescendantOrSame } from '../../helpers/helpers';
import { ColorFormats } from '../../enums/formats';
import { ConverterService } from '../../services/converter.service';
import { defaultColors } from '../../helpers/default-colors';
import { formats } from '../../helpers/formats';





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
      console.log('clickout');
      this.emitClose();
    } 
  }

  constructor(
    public service:ConverterService,
    private changeDetectorRef: ChangeDetectorRef,
    // private appRef: ApplicationRef,
  )
  {
  }
  //IO color
  @Input() color: string = '#00000000';
  @Output() colorChange: EventEmitter<string> = new EventEmitter<string>(false);


  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  //Animation type for the color palette show up
  //slide-in, popup,
  @Input() colorsAnimationEffect = 'slide-in'
  @Input() caller:ElementRef;

  //selected color used for ui before apply format, 
  public previewColor: string = '#000000';
  public colorPickerColor: string = '#000000';

  // public show = false;

  public palette = defaultColors;
  public colorFormats = formats;
  public selectedFormat:number = 0;
  public format:ColorFormats = ColorFormats.HEX;
  public variants = [];
    
  public menu = 1;
 
  private overlay;

  @ViewChild('dialog', { static: false }) dialogElement: ElementRef;


  public ngOnInit(){
    this.overlay = document.createElement('div');
    this.overlay.classList.add('ngx-colors-overlay');
    document.body.appendChild(this.overlay);
  }

  public ngOnDestroy(){
    this.overlay.remove();
  }

  public ngOnChanges(changes: any): void {
    if(changes.color){
      this.previewColor = this.color;
      this.change.emit(this.color);
    }
  }

  public hasVariant(color):boolean{
    return color.variants.some(v => v.toUpperCase() == this.previewColor.toUpperCase() );
  }

  public isSelected(color){
    return color.toUpperCase() == this.previewColor.toUpperCase();
  }


  /**
   * Change color from default colors
   * @param string color
   */
  public changeColor(color: string): void {
    this.previewColor = color;
    this.colorPickerColor = color;
    this.Color = this.service.stringToFormat(color,this.format);
    // this.event.emit(this.rawColor);
    this.menu = 1;
    this.emitClose();
  }

  public nextFormat(){
    this.format = (this.format + 1) % this.colorFormats.length;
    this.Color = this.service.stringToFormat(this.previewColor,this.format);
  }


  

  public showVariants(color){
    this.variants = color.variants;
    this.menu = 2;
  }

  public showColors(){
    this.menu = 1;
  }

  public addColor(){
    this.menu = 3;
  }

  public emitClose(){
    this.close.emit(true);
  }

  public onChangeColorPicker(event) {
    this.previewColor = this.service.toFormat(event,ColorFormats.HEX);
    this.Color = this.service.toFormat(event,this.format);
  }

  /**
   * Change color from input
   * @param string color
   */
  public changeColorManual(color: string): void {
      this.previewColor = color;
      this.colorPickerColor = color;
  }


  isOutside(event){
    this.changeDetectorRef.detectChanges();
    if(this.dialogElement != null){
        return event.target.classList.contains('ngx-colors-overlay');
        // return !(isDescendantOrSame(this.dialogElement.nativeElement,event.target)) && !(isDescendantOrSame(this.caller.nativeElement,event.target))
    } 
    return false;
  }

  get Color(): string {
    return this.color;
  }
  set Color(value: string) {
      this.color = value;
      this.colorChange.next(this.color);
      this.change.next(this.color);
  }



}
