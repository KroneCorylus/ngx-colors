import { Directive, HostListener, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[ngx-colors-trigger]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxColorsTriggerDirective),
      multi: true,
    },
  ],
})
export class NgxColorsTriggerDirective implements ControlValueAccessor {
  constructor() {}
  @HostListener('click') onClick() {
    console.log('click');
  }
  destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  value: string | undefined = undefined;

  writeValue(obj: any): void {
    this.value = obj;
  }

  @Input() disabled: boolean = false;
  onChange = (_: any) => {};
  onTouch = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
