import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComponent } from './panel.component';
import { StateService } from '../../services/state.service';
import { OverlayService } from '../../services/overlay.service';
import { Rgba } from '../../models/rgba';
import { Configuration } from '../../models/configuration';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelComponent],
      providers: [StateService, OverlayService],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('change propagation between controls', () => {
    it('a text change updates the palette and sliders controls without re-emitting', () => {
      const color = new Rgba(1, 2, 3, 1);

      component.textInputCtrl.setValue(color);

      expect(component.paletteCtrl.value).toEqual(color);
      expect(component.slidersCtrl.value).toEqual(color);
    });

    it('a text change commits immediately when text confirmation is off (default)', () => {
      const color = new Rgba(10, 20, 30, 1);
      let lastEmission: { value: unknown; origin: string } | undefined;
      stateService.state.subscribe((state) => (lastEmission = state));

      component.textInputCtrl.setValue(color);

      expect(lastEmission?.origin).toBe('text');
      expect(lastEmission?.value).toEqual(color);
    });

    it('a sliders change emits on sliderChange$ while dragging', () => {
      const color = new Rgba(40, 50, 60, 1);
      const spy = jasmine.createSpy('sliderChange');
      stateService.sliderChange$.subscribe(spy);

      component.slidersCtrl.setValue(color);

      expect(spy).toHaveBeenCalledWith(color);
    });

    it('a sliders change stays pending when sliders confirmation is on (default)', () => {
      const color = new Rgba(40, 50, 60, 1);
      let lastState: { value: unknown; origin: string } | undefined;
      let lastTemp: { value: unknown; origin: string } | undefined;
      stateService.state.subscribe((state) => (lastState = state));
      stateService.temp.subscribe((temp) => (lastTemp = temp));

      component.slidersCtrl.setValue(color);

      expect(lastTemp?.origin).toBe('sliders');
      expect(lastTemp?.value).toEqual(color);
      expect(lastState?.origin).not.toBe('sliders');
    });
  });

  describe('page navigation', () => {
    it('starts on the palette page and switches to sliders and back', () => {
      expect(component.currentPage).toBe('palette');

      component.onClickShowSliders();
      expect(component.currentPage).toBe('sliders');

      component.onClickBack();
      expect(component.currentPage).toBe('palette');
    });
  });

  describe('palette hover', () => {
    it('re-emits hovered colors through the state service', () => {
      const spy = jasmine.createSpy('hover');
      stateService.paleteColorHover$.subscribe(spy);
      const color = new Rgba(9, 8, 7, 1);

      component.onPaletteColorHover(color);
      component.onPaletteColorHover(undefined);

      expect(spy).toHaveBeenCalledWith(color);
      expect(spy).toHaveBeenCalledWith(undefined);
    });
  });

  describe('outside-click shielding', () => {
    it('stops pointerdown propagation so clicks inside the panel do not close it', () => {
      const event = new PointerEvent('pointerdown', { bubbles: true });
      const stopSpy = spyOn(event, 'stopPropagation');

      fixture.nativeElement.dispatchEvent(event);

      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('re-emits the last committed value with origin "cancel"', () => {
      stateService.set({ value: new Rgba(255, 0, 0, 1), origin: 'state' });

      let lastEmission: { value: unknown; origin: string } | undefined;
      stateService.state.subscribe((state) => (lastEmission = state));

      component.cancel();

      expect(lastEmission?.origin).toBe('cancel');
      expect(lastEmission?.value).toEqual(new Rgba(255, 0, 0, 1));
    });

    it('does not change the value, only the origin', () => {
      const committed = new Rgba(10, 20, 30, 1);
      stateService.set({ value: committed, origin: 'confirm' });

      component.cancel();

      let current: unknown;
      stateService.state.subscribe((state) => (current = state.value));
      expect(current).toEqual(committed);
    });
  });

  describe('onTextInputCommit', () => {
    it('closes the panel without re-committing when text confirmation is off (default)', () => {
      const overlayService = TestBed.inject(OverlayService);
      const removePanelSpy = spyOn(overlayService, 'removePanel');
      stateService.set({ value: new Rgba(255, 0, 0, 1), origin: 'text' });

      component.onTextInputCommit();

      expect(removePanelSpy).toHaveBeenCalled();
      let lastOrigin: string | undefined;
      stateService.state.subscribe((state) => (lastOrigin = state.origin));
      expect(lastOrigin).not.toBe('confirm');
    });

    it('confirms the pending value when text confirmation is on', () => {
      stateService.configuration = new Configuration({
        confirmationRequired: { palette: false, text: true, sliders: true },
      });
      const pending = new Rgba(10, 20, 30, 1);
      stateService.setTemp({ value: pending, origin: 'text' });

      component.onTextInputCommit();

      let lastEmission: { value: unknown; origin: string } | undefined;
      stateService.state.subscribe((state) => (lastEmission = state));
      expect(lastEmission?.origin).toBe('confirm');
      expect(lastEmission?.value).toEqual(pending);
    });
  });
});
