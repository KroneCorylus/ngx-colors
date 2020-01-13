import { Injectable, ComponentFactoryResolver, Injector, Inject, TemplateRef, Type, ComponentFactory, ApplicationRef, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PanelComponent } from '../components/panel/panel.component';

@Injectable()
export class PanelFactoryService {
  constructor(
    private resolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector,
  ) { }

  

  componentRef: ComponentRef<PanelComponent>;
  _factory:ComponentFactory<PanelComponent>;
  overlay;
    


  createPanel():ComponentRef<PanelComponent> { 
    
    if(this.componentRef != undefined){
      this.removePanel();
    }
    const factory: ComponentFactory<PanelComponent> = this.resolver.resolveComponentFactory(PanelComponent);
    
    this.componentRef = factory.create(this.injector);
    this.applicationRef.attachView(this.componentRef.hostView);
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    this.overlay = document.createElement('div');
    this.overlay.id = "ngx-colors-overlay";
    this.overlay.classList.add('ngx-colors-overlay');
    document.body.appendChild(this.overlay);
    this.overlay.appendChild(domElem);

    return this.componentRef;
  }

   removePanel() {
    this.applicationRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.overlay.remove();
  }
}