import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  FormField,
  debounce,
  disabled,
  form,
  readonly,
  required,
  validate,
} from '@angular/forms/signals';
import { NgxColorsTriggerDirective } from './trigger.directive';
import { NgxColorsComponent } from '../components/ngx-colors/ngx-colors.component';
import { isValidColor } from '../validators/color-validator';

@Component({
  imports: [NgxColorsTriggerDirective, NgxColorsComponent, FormField],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ngx-colors
      ngxColorsTrigger
      [formField]="fields.color"
      outputModel="HEXA"
      [display]="{ palette: false, sliders: false }"
      [confirmationRequired]="{
        text: confirmation,
        palette: false,
        sliders: true,
      }"
      (colorChange)="colors.push($event)"
      (userChange)="users.push($event)"
    />
  `,
})
class SignalHost {
  data = signal<{ color: string | null }>({ color: '#ff0000' });
  disable = signal(false);
  readOnly = signal(false);
  confirmation = false;
  fields = form(this.data, (path) => {
    required(path.color);
    disabled(path.color, () => this.disable());
    readonly(path.color, () => this.readOnly());
    validate(path.color, ({ value }) =>
      isValidColor(value()) ? null : { kind: 'invalidColor' },
    );
  });
  blurFields = form(this.data, (path) => debounce(path.color, 'blur'));
  colors: Array<string | null | undefined> = [];
  users: Array<string | null | undefined> = [];
}

describe('NgxColorsTriggerDirective native Signal Forms', () => {
  let fixture: ComponentFixture<SignalHost>;
  let host: SignalHost;
  let directive: NgxColorsTriggerDirective;

  beforeEach(() => TestBed.configureTestingModule({ imports: [SignalHost] }));

  function setup(template?: string) {
    if (template) TestBed.overrideTemplate(SignalHost, template);
    fixture = TestBed.createComponent(SignalHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(NgxColorsTriggerDirective);
    host.colors = [];
  }

  function open() {
    directive.openPanel();
    fixture.detectChanges();
  }

  function enter(value: string) {
    const input = document.body.querySelector<HTMLInputElement>(
      'ngx-colors-overlay input',
    )!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function press(label: string) {
    const button = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        'ngx-colors-overlay button',
      ),
    ).find((button) => button.textContent?.trim() === label)!;
    button.click();
    fixture.detectChanges();
  }

  it('binds natively without a ControlValueAccessor provider', () => {
    setup();
    const accessor = fixture.debugElement
      .query(By.directive(NgxColorsTriggerDirective))
      .injector.get(NG_VALUE_ACCESSOR, null, { self: true });
    expect(accessor).toBeNull();
    expect(directive.value()).toBe('#ff0000');
    expect(host.fields.color().dirty()).toBeFalse();
    expect(host.fields.color().touched()).toBeFalse();
  });

  it('renders external updates without rewriting the model or marking the field dirty', () => {
    setup();
    host.data.set({ color: 'rgb(0,255,0)' });
    fixture.detectChanges();
    expect(host.data().color).toBe('rgb(0,255,0)');
    expect(host.colors).toEqual(['#00ff00']);
    expect(host.users).toEqual([]);
    expect(host.fields.color().dirty()).toBeFalse();
    expect(host.fields.color().touched()).toBeFalse();
    open();
    expect(
      document.body.querySelector<HTMLInputElement>('ngx-colors-overlay input')!
        .value,
    ).toBe('rgb(0, 255, 0)');
  });

  it('commits user edits in outputModel format and marks touched on closing', () => {
    setup();
    open();
    expect(host.fields.color().touched()).toBeFalse();
    enter('rgb(0,255,0)');
    expect(host.data().color).toBe('#00ff00');
    expect(host.fields.color().dirty()).toBeTrue();
    expect(host.fields.color().touched()).toBeFalse();
    expect(host.colors).toEqual(['#00ff00']);
    expect(host.users).toEqual(['#00ff00']);
    directive.closePanel();
    expect(host.fields.color().touched()).toBeTrue();
  });

  it('retains repeated user selection events even when the model value is unchanged', () => {
    setup();
    open();
    enter('#ff0000');
    enter('#ff0000');
    expect(host.users).toEqual(['#ff0000', '#ff0000']);
    expect(host.colors).toEqual(['#ff0000', '#ff0000']);
    expect(host.fields.color().dirty()).toBeFalse();
  });

  it('clears to null and exposes required validation through aria-invalid', () => {
    setup();
    open();
    enter('');
    expect(host.data().color).toBeNull();
    expect(
      host.fields
        .color()
        .errors()
        .some((error) => error.kind === 'required'),
    ).toBeTrue();
    expect(
      directive.triggerRef.nativeElement.getAttribute('aria-invalid'),
    ).toBe('true');
  });

  it('validates raw ranges in a Signal Forms schema without clamping the model', () => {
    setup();
    host.data.set({ color: 'rgb(999,0,0)' });
    fixture.detectChanges();
    expect(host.data().color).toBe('rgb(999,0,0)');
    expect(
      host.fields
        .color()
        .errors()
        .some((error) => error.kind === 'invalidColor'),
    ).toBeTrue();
    expect(host.fields.color().dirty()).toBeFalse();
  });

  it('leaves invalid editor text out of the form model', () => {
    setup();
    open();
    enter('rgb(999,0,0)');
    expect(host.data().color).toBe('#ff0000');
    expect(host.fields.color().dirty()).toBeFalse();
    expect(host.users).toEqual([]);
  });

  for (const state of ['disable', 'readOnly'] as const) {
    it(`respects ${state} and dismisses an open panel without committing pending edits`, () => {
      setup();
      host.confirmation = true;
      fixture.detectChanges();
      open();
      enter('#00ff00');
      host[state].set(true);
      fixture.detectChanges();
      expect(directive.isOpen).toBeFalse();
      directive.openPanel();
      expect(directive.isOpen).toBeFalse();
      expect(host.data().color).toBe('#ff0000');
      expect(host.fields.color().dirty()).toBeFalse();
      expect(host.fields.color().touched()).toBeFalse();
      host[state].set(false);
      fixture.detectChanges();
      open();
      expect(directive.isOpen).toBeTrue();
    });
  }

  it('publishes a confirmed edit only on Accept', () => {
    setup();
    host.confirmation = true;
    fixture.detectChanges();
    open();
    enter('#00ff00');
    expect(host.data().color).toBe('#ff0000');
    expect(host.fields.color().dirty()).toBeFalse();
    expect(host.users).toEqual([]);
    press('ACCEPT');
    expect(host.data().color).toBe('#00ff00');
    expect(host.users).toEqual(['#00ff00']);
    expect(host.fields.color().dirty()).toBeTrue();
    expect(host.fields.color().touched()).toBeTrue();
  });

  it('discards canceled edits without marking the field dirty', () => {
    setup();
    host.confirmation = true;
    fixture.detectChanges();
    open();
    enter('#00ff00');
    press('CANCEL');
    expect(host.data().color).toBe('#ff0000');
    expect(host.colors).toEqual([]);
    expect(host.users).toEqual([]);
    expect(host.fields.color().dirty()).toBeFalse();
    expect(host.fields.color().touched()).toBeTrue();
  });

  it('resets an open picker and drops its pending UI edits', () => {
    setup();
    open();
    enter('#00ff00');
    directive.closePanel();
    host.confirmation = true;
    fixture.detectChanges();
    open();
    enter('#0000ff');
    host.fields.color().reset('#ff0000');
    fixture.detectChanges();
    expect(directive.isOpen).toBeFalse();
    expect(host.data().color).toBe('#ff0000');
    expect(host.fields.color().dirty()).toBeFalse();
    expect(host.fields.color().touched()).toBeFalse();
    open();
    expect(
      document.body.querySelector<HTMLInputElement>('ngx-colors-overlay input')!
        .value,
    ).toBe('#ff0000');
  });

  it('supports field-directed focus on the default swatch', () => {
    setup();
    host.fields.color().focusBoundControl();
    expect(document.activeElement).toBe(directive.triggerRef.nativeElement);
  });

  it('opens the default swatch with the keyboard after field-directed focus', () => {
    setup();
    host.fields.color().focusBoundControl();
    directive.triggerRef.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter' }),
    );
    expect(directive.isOpen).toBeTrue();
    expect(host.fields.color().touched()).toBeFalse();
  });

  it('does not touch or commit pending edits when destroyed', () => {
    setup();
    host.confirmation = true;
    fixture.detectChanges();
    open();
    enter('#00ff00');
    fixture.destroy();
    expect(host.data().color).toBe('#ff0000');
    expect(host.fields.color().dirty()).toBeFalse();
    expect(host.fields.color().touched()).toBeFalse();
    expect(document.body.querySelector('ngx-colors-overlay')).toBeNull();
  });

  it('supports a custom trigger element', () => {
    setup(
      '<button ngxColorsTrigger [formField]="fields.color" [palette]="[\'#00ff00\']">Pick</button>',
    );
    open();
    document.body
      .querySelector<HTMLButtonElement>(
        'ngx-colors-overlay ._color-option.bg-transparent',
      )!
      .click();
    fixture.detectChanges();
    expect(host.data().color).toBe('#00ff00');
    expect(host.fields.color().dirty()).toBeTrue();
    expect(host.fields.color().touched()).toBeTrue();
  });

  it('rejects combining color bindings with formField', () => {
    TestBed.overrideTemplate(
      SignalHost,
      '<ngx-colors ngxColorsTrigger [formField]="fields.color" [color]="data().color" />',
    );
    fixture = TestBed.createComponent(SignalHost);
    expect(() => fixture.detectChanges()).toThrowError(/use either.*formField/);
  });

  it('flushes debounce blur when the interaction ends', async () => {
    setup(
      '<ngx-colors ngxColorsTrigger [formField]="blurFields.color" [display]="{palette: false, sliders: false}" />',
    );
    open();
    enter('#00ff00');
    expect(host.data().color).toBe('#ff0000');
    directive.closePanel();
    await fixture.whenStable();
    expect(host.data().color).toBe('#00ff00');
    expect(host.blurFields.color().touched()).toBeTrue();
  });
});
