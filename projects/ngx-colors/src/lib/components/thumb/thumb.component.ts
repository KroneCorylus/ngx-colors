import {
  Component,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'ngx-colors-thumb',
  imports: [],
  templateUrl: './thumb.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './thumb.component.scss',
})
export class ThumbComponent {
  @Input() apparence: 'circle' | 'oval' = 'circle';
  constructor(public elementRef: ElementRef) {}
}
