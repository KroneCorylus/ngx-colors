import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  forwardRef,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Rgba } from '../../models/rgba';
import { Subject, map, merge, take, takeUntil, tap } from 'rxjs';
import { Changes, isInputOrigin } from '../../types/changes';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { PaletteComponent } from '../palette/palette.component';

@Component({
  selector: 'ngx-colors-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColorPickerComponent,
    TextInputComponent,
    PaletteComponent,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PanelComponent),
      multi: true,
    },
  ],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', '../../shared/shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent implements OnInit, OnDestroy {
  constructor(public stateService: StateService) {}
  @HostListener('pointerdown', ['$event'])
  public onClick(event: PointerEvent): void {
    event.stopPropagation();
  }

  private destroy$: Subject<void> = new Subject<void>();

  public paletteCtrl: FormControl<Rgba | null | undefined> = new FormControl<
    Rgba | undefined
  >(undefined);
  public slidersCtrl: FormControl<Rgba | null | undefined> =
    new FormControl<Rgba | null>(null);
  public textInputCtrl: FormControl<Rgba | null | undefined> = new FormControl<
    Rgba | undefined
  >(undefined);

  public tempValue: Rgba | null | undefined = undefined;

  public disabled: boolean = false;

  public currentPage: 'sliders' | 'palette' = 'palette';

  public ngOnInit(): void {
    merge(
      this.stateService.state.pipe(
        map<Changes, Changes>((state: Changes) => {
          return { value: state.value, origin: 'state' };
        }),
      ),
      this.textInputCtrl.valueChanges.pipe(
        map<Rgba | null | undefined, Changes>((newValue) => {
          return { value: newValue, origin: 'text' };
        }),
      ),
      this.slidersCtrl.valueChanges.pipe(
        tap((value) => {
          this.stateService.sliderChange$.emit(value);
        }),
        map<Rgba | null | undefined, Changes>((newValue) => {
          return { value: newValue, origin: 'sliders' };
        }),
      ),
      this.paletteCtrl.valueChanges.pipe(
        map<Rgba | null | undefined, Changes>((newValue) => {
          return { value: newValue, origin: 'palette' };
        }),
      ),
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((changes) => {
        this.stateService.setTemp(changes);
        this.updateCtrlValues(changes);
      });
    //CONFIG AUX
    if (this.stateService.configuration.display.palette === false) {
      this.currentPage = 'sliders';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onPaletteColorHover(color: Rgba | undefined) {
    this.stateService.paleteColorHover$.emit(color);
  }

  private updateCtrlValues(state: Changes) {
    if (!state) {
      return;
    }
    if (isInputOrigin(state.origin)) {
      if (
        !this.stateService.configuration.confirmationRequired?.[state.origin]
      ) {
        this.stateService.set(state);
      }
    }
    if (state.origin != 'palette') {
      this.paletteCtrl.setValue(state.value, { emitEvent: false });
    }
    if (state.origin != 'text') {
      this.textInputCtrl.setValue(state.value, { emitEvent: false });
    }
    if (state.origin != 'sliders') {
      this.slidersCtrl.setValue(state.value, { emitEvent: false });
      console.log('sliderVlaue', this.slidersCtrl.value);
      console.log('set value sliders', state.value);
    }
  }

  public accept() {
    this.stateService.temp.pipe(take(1)).subscribe((tempValue) => {
      console.log('value temp', tempValue);
      this.stateService.set({ value: tempValue.value, origin: 'confirm' });
    });
  }

  public cancel() {
    this.stateService.state.pipe(take(1)).subscribe((value) => {
      this.stateService.set(value);
    });
  }

  public onClickBack() {
    this.currentPage = 'palette';
  }

  public onClickShowSliders() {
    this.currentPage = 'sliders';
  }
}
