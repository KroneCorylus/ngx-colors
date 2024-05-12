import {
  ApplicationRef,
  ComponentRef,
  Injectable,
  createComponent,
} from '@angular/core';
import { OverlayComponent } from '../components/overlay/overlay.component';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  constructor(private applicationRef: ApplicationRef) {}

  componentRef: ComponentRef<OverlayComponent> | undefined = undefined;
  overlay: HTMLElement | undefined;

  createOverlay(
    attachToId: string | undefined,
    overlayClassName: string | undefined
  ): ComponentRef<OverlayComponent> {
    if (this.componentRef != undefined) {
      this.removePanel();
    }

    let hostElement: HTMLElement = document.createElement('ngx-colors-overlay');
    if (overlayClassName) {
      hostElement.classList.add(overlayClassName);
    }
    (document.getElementById(attachToId ?? '') ?? document.body).appendChild(
      hostElement
    );
    let injector = this.applicationRef.injector;

    this.componentRef = createComponent(OverlayComponent, {
      hostElement,
      environmentInjector: injector,
    });
    this.applicationRef.attachView(this.componentRef.hostView);
    return this.componentRef;
  }

  removePanel() {
    if (this.applicationRef && this.componentRef) {
      this.applicationRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      if (this.overlay) {
        this.overlay.remove();
      }
    }
  }
}
