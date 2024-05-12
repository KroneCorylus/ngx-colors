import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-colors',
  standalone: true,
  imports: [],
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss', '../../shared/shared.scss'],
})
export class NgxColorsComponent {
  public previewColor: string = 'rgba(255,0,255,0.3)';
}
