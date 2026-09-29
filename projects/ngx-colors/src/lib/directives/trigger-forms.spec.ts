import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgxColorsTriggerDirective } from './trigger.directive';

@Component({
  imports: [NgxColorsTriggerDirective, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form">
      <button
        type="button"
        ngxColorsTrigger
        formControlName="color"
        outputModel="HEXA"
        [display]="{ palette: false, sliders: false }"
        (colorChange)="colors.push($event)"
        (userChange)="users.push($event)"
      >
        Pick
      </button>
    </form>
  `,
})
class FormsHost {
  form = new FormGroup({ color: new FormControl('#ff0000') });
  colors: Array<string | null | undefined> = [];
  users: Array<string | null | undefined> = [];
  value = '#ff0000';
}

describe('Picker Forms update timing', () => {
  let fixture: ComponentFixture<FormsHost>;
  let directive: NgxColorsTriggerDirective;

  beforeEach(() => TestBed.configureTestingModule({ imports: [FormsHost] }));

  function setup(updateOn: 'change' | 'blur' | 'submit') {
    fixture = TestBed.createComponent(FormsHost);
    fixture.componentInstance.form = new FormGroup({
      color: new FormControl('#ff0000', { updateOn }),
    });
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(NgxColorsTriggerDirective);
    return fixture.componentInstance.form.controls.color;
  }

  function edit() {
    const input = document.body.querySelector<HTMLInputElement>(
      'ngx-colors-overlay input',
    )!;
    input.value = '#00ff00';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('marks the control touched on completion, not when opening or focusing the editor', () => {
    const control = setup('change');
    directive.triggerRef.nativeElement.focus();
    directive.openPanel();
    fixture.detectChanges();
    expect(control.untouched).toBeTrue();
    edit();
    expect(control.value).toBe('#00ff00');
    expect(control.dirty).toBeTrue();
    expect(control.untouched).toBeTrue();
    directive.closePanel();
    expect(control.touched).toBeTrue();
  });

  it('flushes updateOn blur after edits when the panel closes', () => {
    const control = setup('blur');
    directive.openPanel();
    fixture.detectChanges();
    edit();
    expect(control.value).toBe('#ff0000');
    expect(control.pristine).toBeTrue();
    expect(fixture.componentInstance.users).toEqual(['#00ff00']);
    directive.closePanel();
    expect(control.value).toBe('#00ff00');
    expect(control.touched).toBeTrue();
    expect(control.dirty).toBeTrue();
  });

  it('leaves updateOn submit pending until form submission', () => {
    const control = setup('submit');
    directive.openPanel();
    fixture.detectChanges();
    edit();
    directive.closePanel();
    expect(control.value).toBe('#ff0000');
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    expect(control.value).toBe('#00ff00');
    expect(control.touched).toBeTrue();
    expect(control.dirty).toBeTrue();
  });

  it('marks an unopened trigger touched when focus leaves it', () => {
    const control = setup('blur');
    directive.triggerRef.nativeElement.dispatchEvent(new Event('blur'));
    expect(control.touched).toBeTrue();
  });

  it('does not flush pending changes when the picker is destroyed', () => {
    const control = setup('blur');
    directive.openPanel();
    fixture.detectChanges();
    edit();
    fixture.destroy();
    expect(control.value).toBe('#ff0000');
    expect(control.untouched).toBeTrue();
  });

  it('does not report programmatic writes as user edits even with emitEvent false', () => {
    const control = setup('change');
    const valueChanges = jasmine.createSpy('valueChanges');
    control.valueChanges.subscribe(valueChanges);
    fixture.componentInstance.colors = [];
    control.setValue('#00ff00', { emitEvent: false });
    expect(valueChanges).not.toHaveBeenCalled();
    expect(fixture.componentInstance.colors).toEqual(['#00ff00']);
    expect(fixture.componentInstance.users).toEqual([]);
    expect(control.pristine).toBeTrue();
    expect(control.untouched).toBeTrue();
  });

  it('supports ngModel updateOn blur as well as reactive forms', async () => {
    TestBed.overrideTemplate(
      FormsHost,
      `
      <button ngxColorsTrigger [(ngModel)]="value" [ngModelOptions]="{ updateOn: 'blur' }"
        outputModel="HEXA" [display]="{ palette: false, sliders: false }"></button>
    `,
    );
    fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    await fixture.whenStable();
    directive = fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(NgxColorsTriggerDirective);
    directive.openPanel();
    fixture.detectChanges();
    edit();
    expect(fixture.componentInstance.value).toBe('#ff0000');
    directive.closePanel();
    expect(fixture.componentInstance.value).toBe('#00ff00');
  });
});
