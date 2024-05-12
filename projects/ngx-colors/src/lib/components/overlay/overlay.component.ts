import { Component, HostListener, OnInit } from '@angular/core';
import { PanelFactoryService } from '../../services/panel-factory.service';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'ngx-colors-overlay',
  standalone: true,
  imports: [PanelComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit {
  constructor(private panelFactory: PanelFactoryService) {}
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    this.panelFactory.removePanel();
  }

  ngOnInit(): void {}
}
