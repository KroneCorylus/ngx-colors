import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { OverlayService } from '../services/overlay.service';

@Directive({
  selector: '[ngxColorsTrigger]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxColorsTriggerDirective),
      multi: true,
    },
  ],
})
export class NgxColorsTriggerDirective
  implements ControlValueAccessor, OnDestroy
{
  constructor(private overlayService: OverlayService) {}
  @HostListener('click') onClick() {
    this.openPanel();
  }
  @Input() disabled: boolean = false;
  @Output() change: EventEmitter<string | undefined> = new EventEmitter<
    string | undefined
  >();
  destroy$: Subject<void> = new Subject<void>();

  value: string | undefined = undefined;

  public openPanel() {
    this.overlayService.createOverlay(undefined, 'pepe');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(obj: string | undefined): void {
    this.value = obj;
    this.change.emit(obj);
  }

  onChange: (value: string | undefined) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
