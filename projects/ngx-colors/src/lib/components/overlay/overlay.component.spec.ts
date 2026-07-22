import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayComponent } from './overlay.component';
import { OverlayService } from '../../services/overlay.service';
import { StateService } from '../../services/state.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

function makeRect(rect: Partial<DOMRect>): DOMRect {
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect;
}

describe('OverlayComponent', () => {
  let component: OverlayComponent;
  let fixture: ComponentFixture<OverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayComponent, BrowserAnimationsModule],
      providers: [OverlayService, StateService],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updatePosition', () => {
    beforeEach(() => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1024);
      spyOnProperty(window, 'innerHeight').and.returnValue(768);
      spyOn(
        component.panelElementRef.nativeElement,
        'getBoundingClientRect',
      ).and.returnValue(makeRect({ width: 250, height: 300 }));
    });

    it('does nothing when there is no trigger element yet', () => {
      component.x = 42;
      component.y = 42;
      component.triggerNativeElement = undefined;

      component.updatePosition();

      expect(component.x).toBe(42);
      expect(component.y).toBe(42);
    });

    it('opens below and left-aligned to the trigger when there is room', () => {
      const trigger = document.createElement('div');
      spyOn(trigger, 'getBoundingClientRect').and.returnValue(
        makeRect({ top: 100, left: 50, right: 100, bottom: 120 }),
      );
      component.triggerNativeElement = trigger;

      component.updatePosition();

      expect(component.x).toBe(50);
      expect(component.y).toBe(120);
    });

    it('flips above the trigger when there is no room below but there is above', () => {
      const trigger = document.createElement('div');
      spyOn(trigger, 'getBoundingClientRect').and.returnValue(
        // 300px panel does not fit in the 48px left below a trigger this
        // close to the bottom of a 768px-tall viewport.
        makeRect({ top: 700, left: 50, right: 100, bottom: 720 }),
      );
      component.triggerNativeElement = trigger;

      component.updatePosition();

      expect(component.y).toBe(700 - 300);
    });

    it('clamps horizontally so the panel never overflows the right edge', () => {
      const trigger = document.createElement('div');
      spyOn(trigger, 'getBoundingClientRect').and.returnValue(
        makeRect({ top: 100, left: 950, right: 1000, bottom: 120 }),
      );
      component.triggerNativeElement = trigger;

      component.updatePosition();

      expect(component.x).toBe(1024 - 250);
    });

    it('forces the panel above the trigger when configuration.position is "top", even with room below', () => {
      const stateService = TestBed.inject(StateService);
      stateService.configuration.position = 'top';
      const trigger = document.createElement('div');
      spyOn(trigger, 'getBoundingClientRect').and.returnValue(
        makeRect({ top: 100, left: 50, right: 100, bottom: 120 }),
      );
      component.triggerNativeElement = trigger;

      component.updatePosition();

      expect(component.y).toBe(100 - 300);
    });

    it('forces the panel below the trigger when configuration.position is "bottom", even without room', () => {
      const stateService = TestBed.inject(StateService);
      stateService.configuration.position = 'bottom';
      const trigger = document.createElement('div');
      spyOn(trigger, 'getBoundingClientRect').and.returnValue(
        makeRect({ top: 700, left: 50, right: 100, bottom: 720 }),
      );
      component.triggerNativeElement = trigger;

      component.updatePosition();

      expect(component.y).toBe(720);
    });
  });

  describe('scroll and resize handling', () => {
    it('recomputes the position on document scroll', () => {
      const spy = spyOn(component, 'updatePosition');
      document.dispatchEvent(new Event('scroll'));
      expect(spy).toHaveBeenCalled();
    });

    it('recomputes the position on window resize', () => {
      const spy = spyOn(component, 'updatePosition');
      window.dispatchEvent(new Event('resize'));
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('dialog semantics (C16)', () => {
    it('exposes role=dialog, aria-modal and a non-tabbable tabindex on its host', () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.getAttribute('role')).toBe('dialog');
      expect(host.getAttribute('aria-modal')).toBe('true');
      expect(host.getAttribute('tabindex')).toBe('-1');
    });

    it('closes the panel on Escape', () => {
      const overlayService = TestBed.inject(OverlayService);
      const spy = spyOn(overlayService, 'removePanel');
      fixture.nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      expect(spy).toHaveBeenCalled();
    });

    it('focusPanel() moves focus to the overlay host', () => {
      document.body.appendChild(fixture.nativeElement);
      component.focusPanel();
      expect(document.activeElement).toBe(fixture.nativeElement);
      fixture.nativeElement.remove();
    });

    it('returns focus to the trigger element on destroy', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      const focusSpy = spyOn(trigger, 'focus');
      component.triggerNativeElement = trigger;

      component.ngOnDestroy();

      expect(focusSpy).toHaveBeenCalled();
      trigger.remove();
    });

    it('does not throw on destroy when no trigger element was recorded', () => {
      component.triggerNativeElement = undefined;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    describe('Tab focus trap', () => {
      let first: HTMLButtonElement;
      let last: HTMLButtonElement;

      beforeEach(() => {
        fixture.nativeElement.innerHTML = '';
        first = document.createElement('button');
        last = document.createElement('button');
        fixture.nativeElement.appendChild(first);
        fixture.nativeElement.appendChild(last);
        document.body.appendChild(fixture.nativeElement);
      });

      afterEach(() => {
        fixture.nativeElement.remove();
      });

      it('wraps Tab from the last focusable element back to the first', () => {
        last.focus();
        const event = new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
        });
        const preventDefault = spyOn(event, 'preventDefault');
        fixture.nativeElement.dispatchEvent(event);
        expect(preventDefault).toHaveBeenCalled();
        expect(document.activeElement).toBe(first);
      });

      it('wraps Shift+Tab from the first focusable element back to the last', () => {
        first.focus();
        const event = new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
        });
        const preventDefault = spyOn(event, 'preventDefault');
        fixture.nativeElement.dispatchEvent(event);
        expect(preventDefault).toHaveBeenCalled();
        expect(document.activeElement).toBe(last);
      });

      it('does not interfere with Tab in the middle of the sequence', () => {
        first.focus();
        const event = new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
        });
        const preventDefault = spyOn(event, 'preventDefault');
        fixture.nativeElement.dispatchEvent(event);
        expect(preventDefault).not.toHaveBeenCalled();
      });
    });
  });
});
