import { TestBed } from '@angular/core/testing';
import { ApplicationRef, Injector } from '@angular/core';

import { OverlayService } from './overlay.service';
import { StateService } from './state.service';

describe('OverlayService', () => {
  let service: OverlayService;
  let injector: Injector;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverlayService, ApplicationRef, StateService],
    });

    service = TestBed.inject(OverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should append overlay element to body', () => {
    service.createOverlay(undefined, undefined, injector);
    const overlay =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlay).toBeTruthy();
  });

  it('should not append multiple overlays', () => {
    service.createOverlay(undefined, undefined, injector);
    service.createOverlay(undefined, undefined, injector);
    const overlayCount =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlayCount).toBeLessThan(2);
  });

  it('should remove overlay from the DOM', () => {
    service.createOverlay(undefined, undefined, injector);
    service.removePanel();
    const overlay =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlay).toBeFalsy();
  });
});
