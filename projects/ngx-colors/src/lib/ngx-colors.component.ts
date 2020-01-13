import { Component, EventEmitter, Input, Output, OnInit, OnDestroy,ComponentRef, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, ViewEncapsulation, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, ApplicationRef, EmbeddedViewRef, Injector } from '@angular/core';
import { defaultColors } from './helpers/default-colors';
import { formats } from './helpers/formats';
import { ConverterService } from './services/converter.service';
import { ColorFormats } from './enums/formats';
import { isDescendantOrSame } from './helpers/helpers';
import { PanelFactoryService } from './services/panel-factory.service';
import { PanelComponent } from './components/panel/panel.component';

@Component({
  selector: 'ngx-colors',
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
})
export class NgxColorsComponent{

  constructor(
  )
  {
  }

  //IO color
  @Input() color: string = '#00000000';
 
}
