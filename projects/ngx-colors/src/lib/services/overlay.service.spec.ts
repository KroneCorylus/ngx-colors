import { TestBed } from '@angular/core/testing';
import { ApplicationRef, Injector } from '@angular/core';

import { OverlayService } from './overlay.service';
import { StateService } from './state.service';
import { Configuration } from '../models/configuration';

describe('OverlayService', () => {
  let service: OverlayService;
  let stateService: StateService;
  let injector: Injector;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OverlayService,
        ApplicationRef,
        StateService,
      ],
    });

    service = TestBed.inject(OverlayService);
    stateService = TestBed.inject(StateService);
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

  describe('configuration-driven overlay options', () => {
    afterEach(() => {
      service.removePanel();
    });

    it('applies overlayClass to the overlay host element', () => {
      stateService.configuration = new Configuration({
        overlayClass: 'my-overlay-class',
      });

      service.createOverlay(undefined, injector);

      const overlay = document.body.querySelector('ngx-colors-overlay');
      expect(overlay?.classList.contains('my-overlay-class')).toBeTrue();
    });

    it('attaches the overlay to the element matching an overlayAttachTo id', () => {
      const parent = document.createElement('div');
      parent.id = 'attach-target';
      document.body.appendChild(parent);
      stateService.configuration = new Configuration({
        overlayAttachTo: 'attach-target',
      });

      try {
        service.createOverlay(undefined, injector);
        expect(
          parent.querySelector('ngx-colors-overlay'),
        ).not.toBeNull();
      } finally {
        service.removePanel();
        parent.remove();
      }
    });

    it('throws when the overlayAttachTo id does not exist', () => {
      stateService.configuration = new Configuration({
        overlayAttachTo: 'does-not-exist',
      });

      expect(() => service.createOverlay(undefined, injector)).toThrowError(
        'Overlay parent not found',
      );
    });

    it('attaches the overlay to an overlayAttachTo element reference', () => {
      const parent = document.createElement('div');
      document.body.appendChild(parent);
      stateService.configuration = new Configuration({
        overlayAttachTo: parent,
      });

      try {
        service.createOverlay(undefined, injector);
        expect(
          parent.querySelector('ngx-colors-overlay'),
        ).not.toBeNull();
      } finally {
        service.removePanel();
        parent.remove();
      }
    });
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
