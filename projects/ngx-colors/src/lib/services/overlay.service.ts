import {
  ApplicationRef,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  Optional,
  createComponent,
} from '@angular/core';
import { OverlayComponent } from '../components/overlay/overlay.component';
import { NgxColorsTriggerDirective } from '../directives/trigger.directive';
import {
  NGX_COLORS_CONFIG,
  NgxColorsConfiguration,
} from '../interfaces/configuration';
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
    attachToId: string | undefined,
    injector: Injector,
  ): ComponentRef<OverlayComponent> {
    if (this.componentRef != undefined) {
      this.removePanel();
    }

    const hostElement: HTMLElement =
      document.createElement('ngx-colors-overlay');
    if (this.stateService.configuration.overlayClass) {
      hostElement.classList.add(this.stateService.configuration.overlayClass);
    }
    (document.getElementById(attachToId ?? '') ?? document.body).appendChild(
      hostElement,
    );
    const environmentInjector = this.applicationRef.injector;

    this.componentRef = createComponent(OverlayComponent, {
      hostElement,
      environmentInjector,
      elementInjector: injector,
    });

    this.componentRef.instance.triggerNativeElement =
      trigger?.triggerRef.nativeElement;
    if (trigger) {
      const viewportOffset =
        trigger.triggerRef.nativeElement.getBoundingClientRect();

      const top = viewportOffset.top + viewportOffset.height;
      const left = viewportOffset.left;
      this.componentRef.instance.x = left;
      this.componentRef.instance.y = top;
    }
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
