import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { Rgba } from '../../models/rgba';
import { defaultColors } from '../../utility/default-colors';
import { PaletteColor } from '../../models/color';
import { CommonModule } from '@angular/common';
import { PaletteStack } from '../../models/palette-stack';
import { ColorOption } from '../../types/color-option';
import { paletteAnimation } from '../../utility/animations';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'ngx-colors-palette',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaletteComponent),
      multi: true,
    },
  ],
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss', '../../shared/shared.scss'],
  animations: [paletteAnimation],
})
export class PaletteComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  constructor(
    public stateService: StateService,
    private cd: ChangeDetectorRef,
  ) {}
  private destroy$: Subject<void> = new Subject<void>();
  private value: Rgba | undefined = undefined;
  public disabled: boolean = false;
  public paletteStack: PaletteStack = new PaletteStack();
  //Used to highlight the selected color on the palette
  private selected: Rgba | undefined = undefined;
  public indexSelected: number = -1;

  public loading = false;

  @Output() colorHover: EventEmitter<Rgba | undefined> = new EventEmitter<
    Rgba | undefined
  >();

  @Input()
  public palette$: Observable<Array<ColorOption>> | undefined =
    of(defaultColors);

  public ngOnInit(): void {
    this.getPalette(this.palette$);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClickBack() {
    this.paletteStack.pop();
    this.indexSelected = this.getIndexSelected(this.selected);
  }

  public onMouseEnter(color: PaletteColor) {
    this.colorHover.emit(color.value);
  }

  private getPalette(palette: Observable<Array<ColorOption>> | undefined) {
    if (!palette) return;
    if (this.palette$ instanceof Observable) {
      if (this.paletteStack.size == 0) {
        this.loading = true;
      }
      this.palette$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (colors) => {
          this.paletteStack.clear();
          this.paletteStack.push(colors.map((c) => new PaletteColor(c)));
          if (this.loading) {
            this.loading = false;
            this.cd.detectChanges();
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.loading = false;
          this.cd.detectChanges();
        },
      });
    } else {
      throw new Error('The palette provided is not an Observable');
    }
  }

  //Compares by underlying rounded value rather than raw string, since
  //palette entries and the selected value can be written in different
  //formats/precisions (e.g. "#e57373" vs "#e57373ff") while being the same color.
  private isSameColor(a: Rgba | undefined, b: Rgba | undefined): boolean {
    if (!a || !b) return false;
    const ra = a.toRounded();
    const rb = b.toRounded();
    return ra.r === rb.r && ra.g === rb.g && ra.b === rb.b && ra.a === rb.a;
  }

  private isSelected(color: PaletteColor, selected: Rgba): boolean {
    return (
      this.isSameColor(color.value, selected) ||
      (!!color.childs?.length &&
        color.childs.some((child) => this.isSelected(child, selected)))
    );
  }

  private getIndexSelected(selected: Rgba | undefined): number {
    if (selected === undefined || !this.paletteStack?.size) {
      return -1;
    }
    return this.paletteStack
      .last()
      .findIndex((c) => this.isSelected(c, selected));
  }

  public onClickColor(color: PaletteColor) {
    if (color.childs?.length) {
      this.paletteStack.push(color.childs);
    } else {
      this.selected = color.value;
      this.value = color.value;
      this.onChange(this.value);
    }
    this.indexSelected = this.getIndexSelected(this.selected);
  }

  writeValue(obj: Rgba | undefined): void {
    this.value = obj;
    if (this.value) {
      this.selected = this.value;
      this.indexSelected = this.getIndexSelected(this.selected);
    }
  }

  onChange: (value: Rgba | undefined) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: Rgba | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
