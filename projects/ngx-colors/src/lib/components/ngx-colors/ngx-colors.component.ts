import { Component, Host, OnInit, Optional, Self } from '@angular/core';
import { NgxColorsTriggerDirective } from '../../directives/trigger.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ngx-colors',
  standalone: true,
  imports: [],
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss', '../../shared/shared.scss'],
})
export class NgxColorsComponent implements OnInit {
  constructor(
    @Host() private triggerDirective: NgxColorsTriggerDirective,
    @Self() @Optional() private ngControl: NgControl,
  ) {}
  public previewColor: string | null | undefined = 'rgba(255,0,255,0.3)';

  ngOnInit(): void {
    if (!this.triggerDirective) {
      console.error(
        'NgxColorsComponent initialization error: The component must be used in conjunction with the NgxColorsTriggerDirective. Ensure that you have the directive included in your template.',
      );
      return;
    }
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.valueChanges?.subscribe((color) => {
        console.log('[ngx-colors] value', color);
        this.previewColor = color;
      });
    } else {
      //fallback when is not used on a ngControl
      const old = this.triggerDirective.onChange;
      this.triggerDirective.onChange = (value) => {
        this.previewColor = value;
        old(value);
      };
    }
  }
}
