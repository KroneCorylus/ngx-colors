import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'ngx-colors-panel',
  standalone: true,
  imports: [],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', '../../shared/shared.scss'],
})
export class PanelComponent {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
}
