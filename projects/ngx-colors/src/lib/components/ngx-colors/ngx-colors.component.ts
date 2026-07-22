import { Component, Host, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgxColorsTriggerDirective } from '../../directives/trigger.directive';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'ngx-colors',
  standalone: true,
  imports: [],
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss', '../../shared/shared.scss'],
})
export class NgxColorsComponent implements OnInit, OnDestroy {
  constructor(
    @Host() private triggerDirective: NgxColorsTriggerDirective,
    private stateService: StateService,
  ) {}
  public previewColor: string | null | undefined = undefined;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    if (!this.triggerDirective) {
      console.error(
        'NgxColorsComponent initialization error: The component must be used in conjunction with the NgxColorsTriggerDirective. Ensure that you have the directive included in your template.',
      );
      return;
    }
    this.stateService.state
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.previewColor = state.value?.toString();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
