import { ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector, ViewContainerRef } from '@angular/core'
import { PanelComponent } from '../components/panel/panel.component'

@Injectable()
export class ComponentFactoryService {
  constructor(
    public factoryResolver:ComponentFactoryResolver) {
  }

  rootViewContainer: ViewContainerRef;

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addPanelComponent() {
    const factory = this.factoryResolver
                        .resolveComponentFactory(PanelComponent)
    const component = factory
      .create(this.rootViewContainer.parentInjector)
    this.rootViewContainer.insert(component.hostView)
  }
}