import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from './text-input.component';
import { StateService } from '../../services/state.service';

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
