import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import { OverlayService } from '../../services/overlay.service';
import { StateService } from '../../services/state.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { computeOverlayPosition } from '../../utility/overlay-position';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({
  selector: 'ngx-colors-overlay',
  standalone: true,
  imports: [PanelComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnDestroy {
  constructor(
    private overlayService: OverlayService,
    private stateService: StateService,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  x: number = 0;
  y: number = 0;
  triggerNativeElement: HTMLElement | undefined = undefined;

  @HostBinding('attr.role') role = 'dialog';
  @HostBinding('attr.aria-modal') ariaModal = 'true';
  @HostBinding('attr.aria-label') ariaLabel = 'Color picker';
  @HostBinding('attr.tabindex') tabIndex = -1;

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
  @HostListener('keydown.escape')
  public onEscape(): void {
    this.overlayService.removePanel();
  }
  @HostListener('keydown.tab', ['$event'])
  @HostListener('keydown.shift.tab', ['$event'])
  public onTab(event: KeyboardEvent): void {
    const focusable = Array.from(
      this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      ),
    );
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  public ngOnDestroy(): void {
    this.triggerNativeElement?.focus();
  }

  public focusPanel(): void {
    this.elementRef.nativeElement.focus();
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
      this.stateService.configuration.position,
    );
    this.x = position.left;
    this.y = position.top;
  }
}
