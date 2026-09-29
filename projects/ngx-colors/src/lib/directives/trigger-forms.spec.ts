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

  for (const updateOn of ['blur', 'submit'] as const) {
    it(`rejects reactive updateOn ${updateOn} with an actionable error`, () => {
      expect(() => setup(updateOn)).toThrowError(
        /updateOn:.*not supported.*FormValueControl/,
      );
    });

    it(`rejects inherited updateOn ${updateOn}`, () => {
      fixture = TestBed.createComponent(FormsHost);
      fixture.componentInstance.form = new FormGroup(
        {
          color: new FormControl('#ff0000'),
        },
        { updateOn },
      );
      expect(() => fixture.detectChanges()).toThrowError(
        /updateOn:.*not supported/,
      );
    });

    it(`rejects ngModel updateOn ${updateOn}`, () => {
      TestBed.overrideTemplate(
        FormsHost,
        `
        <button ngxColorsTrigger [(ngModel)]="value"
          [ngModelOptions]="{ updateOn: '${updateOn}' }"></button>
      `,
      );
      fixture = TestBed.createComponent(FormsHost);
      expect(() => fixture.detectChanges()).toThrowError(
        /updateOn:.*not supported/,
      );
    });
  }

  it('marks an unopened trigger touched when focus leaves it', () => {
    const control = setup('change');
    directive.triggerRef.nativeElement.dispatchEvent(new Event('blur'));
    expect(control.touched).toBeTrue();
  });

  it('rejects unsupported timing when the bound control is replaced', () => {
    setup('change');
    fixture.componentInstance.form.setControl(
      'color',
      new FormControl('#ff0000', { updateOn: 'submit' }),
    );
    expect(() => fixture.detectChanges()).toThrowError(
      /updateOn: 'submit'.*not supported/,
    );
  });

  it('rejects timing inherited from ngForm after control registration', async () => {
    TestBed.overrideTemplate(
      FormsHost,
      `
      <form [ngFormOptions]="{ updateOn: 'blur' }">
        <button ngxColorsTrigger [(ngModel)]="value" name="color"></button>
      </form>
    `,
    );
    fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    await Promise.resolve();
    expect(() => fixture.detectChanges()).toThrowError(
      /updateOn: 'blur'.*not supported/,
    );
  });

  it('resets the classic Forms model without marking touched', () => {
    const control = setup('change');
    directive.openPanel();
    fixture.detectChanges();
    edit();
    control.reset('#0000ff');
    fixture.detectChanges();
    expect(directive.value()).toBe('#0000ff');
    expect(control.pristine).toBeTrue();
    expect(control.untouched).toBeTrue();
  });

  it('does not mark touched when the picker is destroyed', () => {
    const control = setup('change');
    directive.openPanel();
    fixture.detectChanges();
    edit();
    fixture.destroy();
    expect(control.value).toBe('#00ff00');
    expect(control.untouched).toBeTrue();
  });

  it('does not report programmatic writes as user edits even with emitEvent false', () => {
    const control = setup('change');
    const valueChanges = jasmine.createSpy('valueChanges');
    control.valueChanges.subscribe(valueChanges);
    fixture.componentInstance.colors = [];
    control.setValue('#00ff00', { emitEvent: false });
    fixture.detectChanges();
    expect(valueChanges).not.toHaveBeenCalled();
    expect(fixture.componentInstance.colors).toEqual(['#00ff00']);
    expect(fixture.componentInstance.users).toEqual([]);
    expect(control.pristine).toBeTrue();
    expect(control.untouched).toBeTrue();
  });

  it('supports the default ngModel update timing', async () => {
    TestBed.overrideTemplate(
      FormsHost,
      `
      <button ngxColorsTrigger [(ngModel)]="value"
        outputModel="HEXA" [display]="{ palette: false, sliders: false }"></button>
    `,
    );
    fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(NgxColorsTriggerDirective);
    expect(directive.value()).toBe('#ff0000');
    directive.openPanel();
    fixture.detectChanges();
    edit();
    expect(fixture.componentInstance.value).toBe('#00ff00');
  });
});
