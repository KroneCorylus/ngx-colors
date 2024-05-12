import { Component, HostListener, OnInit } from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'ngx-colors-overlay',
  standalone: true,
  imports: [PanelComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit {
  constructor(private overlayService: OverlayService) {}
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    this.overlayService.removePanel();
  }

  ngOnInit(): void {}
}
