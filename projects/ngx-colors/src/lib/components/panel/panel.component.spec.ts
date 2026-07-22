import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComponent } from './panel.component';
import { StateService } from '../../services/state.service';
import { OverlayService } from '../../services/overlay.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Rgba } from '../../models/rgba';
import { Configuration } from '../../models/configuration';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelComponent, BrowserAnimationsModule],
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
