import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { OverlayService } from '../services/overlay.service';

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
  constructor(private overlayService: OverlayService) {}
  @HostListener('click') onClick() {
    this.openPanel();
  }
  @Input() disabled: boolean = false;
  @Output() change: EventEmitter<string | undefined> = new EventEmitter<
    string | undefined
  >();
  destroy$: Subject<void> = new Subject<void>();

  public openPanel() {
    console.log('openPanel');
    this.overlayService.createOverlay(undefined, 'pepe');
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  value: string | undefined = undefined;

  writeValue(obj: any): void {
    this.value = obj;
    this.change.emit(obj);
  }

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
