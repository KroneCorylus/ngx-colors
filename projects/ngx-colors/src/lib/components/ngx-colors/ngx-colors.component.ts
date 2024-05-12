import { Component, Host, OnInit } from '@angular/core';
import { NgxColorsTriggerDirective } from '../../directives/trigger.directive';

@Component({
  selector: 'ngx-colors',
  standalone: true,
  imports: [],
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss', '../../shared/shared.scss'],
})
export class NgxColorsComponent implements OnInit {
  constructor(@Host() private triggerDirective: NgxColorsTriggerDirective) {}
  public previewColor: string | undefined = 'rgba(255,0,255,0.3)';

  ngOnInit(): void {
    if (!this.triggerDirective) {
      console.error('ngx-colors call without ngx-colors-trigger directive');
      return;
    }
    this.triggerDirective.change.subscribe((c) => {
      this.previewColor = c;
    });
  }
}
