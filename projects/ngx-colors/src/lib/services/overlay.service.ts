import {
  ApplicationRef,
  ComponentRef,
  Injectable,
  Injector,
  createComponent,
} from '@angular/core';
import { OverlayComponent } from '../components/overlay/overlay.component';
import { NgxColorsTriggerDirective } from '../directives/trigger.directive';
import { StateService } from './state.service';

@Injectable()
export class OverlayService {
  constructor(
    private applicationRef: ApplicationRef,
    private stateService: StateService,
  ) {}

  componentRef: ComponentRef<OverlayComponent> | undefined = undefined;
  overlay: HTMLElement | undefined;

  createOverlay(
    trigger: NgxColorsTriggerDirective | undefined,
    injector: Injector,
  ): ComponentRef<OverlayComponent> {
    if (this.componentRef != undefined) {
      this.removePanel();
    }

    const hostElement: HTMLElement =
      document.createElement('ngx-colors-overlay');
    this.overlay = hostElement;
    if (this.stateService.configuration.overlayClass) {
      hostElement.classList.add(this.stateService.configuration.overlayClass);
    }
    let parent = document.body;
    const attachTo = this.stateService.configuration.overlayAttachTo;
    if (attachTo) {
      if (typeof attachTo == 'string') {
        const auxParent = document.getElementById(attachTo);
        if (!auxParent) {
          throw new Error('Overlay parent not found');
        }
        parent = auxParent;
      } else {
        parent = attachTo;
      }
    }

    parent.appendChild(hostElement);
    const environmentInjector = this.applicationRef.injector;

    this.componentRef = createComponent(OverlayComponent, {
      hostElement,
      environmentInjector,
      elementInjector: injector,
    });

    this.componentRef.instance.triggerNativeElement =
      trigger?.triggerRef.nativeElement;
    this.componentRef.instance.updatePosition();
    this.applicationRef.attachView(this.componentRef.hostView);
    return this.componentRef;
  }

  removePanel() {
    if (this.applicationRef && this.componentRef) {
      this.applicationRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      // Explicitly detach the host node instead of relying on destroy() to
      // do it: it was created and appended by hand in createOverlay(), and
      // Angular does not take ownership of externally-supplied host
      // elements, so it is our responsibility to remove it.
      this.overlay?.remove();
    }
    this.componentRef = undefined;
    this.overlay = undefined;
  }
}
