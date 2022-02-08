import { Component, Host, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxColorsTriggerDirective } from './directives/ngx-colors-trigger.directive';

@Component({
  selector: 'ngx-colors',
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss'],
})
export class NgxColorsComponent implements OnInit, OnDestroy {
  private triggerDirectiveColorChangeSubscription: Subscription | null = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    @Host() private triggerDirective: NgxColorsTriggerDirective
  ) {}

  ngOnInit(): void {
    this.triggerDirectiveColorChangeSubscription =
      this.triggerDirective.change.subscribe((color) => {
        this.color = color;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.triggerDirectiveColorChangeSubscription) {
      this.triggerDirectiveColorChangeSubscription.unsubscribe();
    }
  }

  //IO color
  color: string = this.triggerDirective.color;
}
