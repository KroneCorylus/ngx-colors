import { TestBed } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';

import { OverlayService } from './overlay.service';

describe('OverlayService', () => {
  let service: OverlayService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverlayService, ApplicationRef],
    });
    service = TestBed.inject(OverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should append overlay element to body', () => {
    service.createOverlay(undefined, undefined);
    let overlay =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlay).toBeTruthy();
  });

  it('should not append multiple overlays', () => {
    service.createOverlay(undefined, undefined);
    service.createOverlay(undefined, undefined);
    let overlayCount =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlayCount).toBeLessThan(2);
  });

  it('should remove overlay from the DOM', () => {
    service.createOverlay(undefined, undefined);
    service.removePanel();
    let overlay =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlay).toBeFalsy();
  });
});
