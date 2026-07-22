import { TestBed } from '@angular/core/testing';
import { ApplicationRef, Injector } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { OverlayService } from './overlay.service';
import { StateService } from './state.service';

describe('OverlayService', () => {
  let service: OverlayService;
  let injector: Injector;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OverlayService,
        ApplicationRef,
        StateService,
        provideNoopAnimations(),
      ],
    });

    service = TestBed.inject(OverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should append overlay element to body', () => {
    service.createOverlay(undefined, injector);
    const overlay =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlay).toBeTruthy();
  });

  it('should not append multiple overlays', () => {
    service.createOverlay(undefined, injector);
    service.createOverlay(undefined, injector);
    const overlayCount =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlayCount).toBeLessThan(2);
  });

  it('should remove overlay from the DOM', () => {
    service.createOverlay(undefined, injector);
    service.removePanel();
    const overlay =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlay).toBeFalsy();
  });

  it('should not throw when removePanel is called with no overlay open', () => {
    expect(() => service.removePanel()).not.toThrow();
  });

  it('should not throw when removePanel is called twice in a row', () => {
    service.createOverlay(undefined, injector);
    service.removePanel();
    expect(() => service.removePanel()).not.toThrow();
  });

  it('should allow opening a new overlay after the previous one was removed', () => {
    service.createOverlay(undefined, injector);
    service.removePanel();
    service.createOverlay(undefined, injector);
    const overlayCount =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlayCount).toBe(1);
  });

  it('should emit opened when an overlay is created', () => {
    const spy = jasmine.createSpy('opened');
    service.opened.subscribe(spy);
    service.createOverlay(undefined, injector);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit closed when an open overlay is removed', () => {
    const spy = jasmine.createSpy('closed');
    service.closed.subscribe(spy);
    service.createOverlay(undefined, injector);
    service.removePanel();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit closed when removePanel is called with nothing open', () => {
    const spy = jasmine.createSpy('closed');
    service.closed.subscribe(spy);
    service.removePanel();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit closed then opened when replacing an already-open overlay', () => {
    const events: string[] = [];
    service.opened.subscribe(() => events.push('opened'));
    service.closed.subscribe(() => events.push('closed'));

    service.createOverlay(undefined, injector);
    events.length = 0; // ignore the first open, only inspect the replace cycle
    service.createOverlay(undefined, injector);

    expect(events).toEqual(['closed', 'opened']);
  });
});
