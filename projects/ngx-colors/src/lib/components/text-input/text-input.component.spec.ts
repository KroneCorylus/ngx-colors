import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from './text-input.component';
import { StateService } from '../../services/state.service';
import { Rgba } from '../../models/rgba';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputComponent],
      providers: [StateService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('placeholder', () => {
    it('shows white in the current color model on init', () => {
      expect(component.placeholder).toBe('rgb(255, 255, 255)');
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe('rgb(255, 255, 255)');
    });

    it('updates when the color model is cycled', () => {
      component.onClickColorModel();
      expect(component.placeholder).toBe('cmyk(0%, 0%, 0%, 0%)');
    });
  });

  describe('color model cycling with a value present', () => {
    it('reformats the current value into the newly selected model', () => {
      component.writeValue(new Rgba(255, 0, 0, 1));
      expect(component.inputControl.value).toBe('rgb(255, 0, 0)');

      component.onClickColorModel();

      expect(component.inputControl.value).toBe('cmyk(0%, 100%, 100%, 0%)');
    });
  });

  describe('typing behavior', () => {
    function getInput(): HTMLInputElement {
      return fixture.nativeElement.querySelector('input');
    }

    it('does not reformat the field while the user is typing', () => {
      getInput().dispatchEvent(new Event('focus'));
      component.inputControl.setValue('cmyk(18, 20, 20, 2)');
      component.writeValue(new Rgba(1, 2, 3, 1));

      expect(component.inputControl.value).toBe('cmyk(18, 20, 20, 2)');
    });

    it('switches the active color model to the model the user typed', () => {
      const stateService = TestBed.inject(StateService);
      getInput().dispatchEvent(new Event('focus'));
      component.inputControl.setValue('cmyk(0, 50, 100, 0)');

      expect(component.availableModels[component.colorModelIndex]).toBe(
        'CMYK',
      );
      expect(stateService.colorModel).toBe('CMYK');
    });

    it('reformats to the typed model on blur', () => {
      getInput().dispatchEvent(new Event('focus'));
      component.inputControl.setValue('cmyk(0,50,100,0)');
      getInput().dispatchEvent(new Event('blur'));

      expect(component.inputControl.value).toBe('cmyk(0%, 50%, 100%, 0%)');
    });

    it('reformats immediately when the value is written while not focused', () => {
      component.writeValue(new Rgba(255, 0, 0, 1));

      expect(component.inputControl.value).toBe('rgb(255, 0, 0)');
    });

    it('does not propagate out-of-range values even though they match a pattern', () => {
      const spy = jasmine.createSpy('onChange');
      component.registerOnChange(spy);
      component.inputControl.setValue('rgb(999, 0, 0)');

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('commit', () => {
    it('emits when Enter is pressed on the input', () => {
      let emitted = false;
      component.commit.subscribe(() => (emitted = true));
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(emitted).toBeTrue();
    });
  });
});
