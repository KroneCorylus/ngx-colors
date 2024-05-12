import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { defaultColors } from '../../utility/default-colors';
@Component({
  selector: 'ngx-colors-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', '../../shared/shared.scss'],
})
export class PanelComponent implements OnInit {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
  public colors: Array<any> = defaultColors;
  public selected: string = '#9575CD';
  constructor() {}

  ngOnInit(): void {}
}
