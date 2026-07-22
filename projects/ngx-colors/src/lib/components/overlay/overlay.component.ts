import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import { OverlayService } from '../../services/overlay.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { computeOverlayPosition } from '../../utility/overlay-position';

@Component({
  selector: 'ngx-colors-overlay',
  standalone: true,
  imports: [PanelComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  constructor(private overlayService: OverlayService) {}

  x: number = 0;
  y: number = 0;
  triggerNativeElement: HTMLElement | undefined = undefined;

  @ViewChild(PanelComponent, { static: true })
  panel!: PanelComponent;
  @ViewChild(PanelComponent, { read: ElementRef, static: true })
  panelElementRef!: ElementRef<HTMLElement>;

  @HostListener('document:scroll')
  onScroll() {
    this.updatePosition();
  }
  @HostListener('window:resize')
  onResize() {
    this.updatePosition();
  }
  @HostListener('pointerdown', ['$event'])
  public onClick(): void {
    this.overlayService.removePanel();
  }

  /**
   * Recomputes the panel's position relative to its trigger, keeping it
   * inside the viewport: it opens below the trigger by default, flips above
   * when there isn't room below (but there is above), and clamps
   * horizontally so it never runs past the left/right edge of the screen.
   * Called on initial open (from OverlayService, once the trigger reference
   * is available) and again on scroll/resize.
   */
  public updatePosition(): void {
    if (!this.triggerNativeElement) return;
    const triggerRect = this.triggerNativeElement.getBoundingClientRect();
    const panelRect = this.panelElementRef.nativeElement.getBoundingClientRect();
    const position = computeOverlayPosition(
      triggerRect,
      { width: panelRect.width, height: panelRect.height },
      { width: window.innerWidth, height: window.innerHeight },
    );
    this.x = position.left;
    this.y = position.top;
  }
}
