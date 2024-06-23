import { Component, HostListener } from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'ngx-colors-overlay',
  standalone: true,
  imports: [PanelComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  constructor(private overlayService: OverlayService) {}
  @HostListener('click', ['$event'])
  public onClick(): void {
    this.overlayService.removePanel();
  }
}
