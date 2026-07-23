import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgxColorsComponent,
  NgxColorsTriggerDirective,
} from '../../../../../ngx-colors/src/public-api';

@Component({
  selector: 'app-dialog-test',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxColorsComponent, NgxColorsTriggerDirective],
  templateUrl: './dialog-test.component.html',
  styleUrl: './dialog-test.component.scss',
})
export class DialogTestComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dlg', { static: true })
  dialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('triggerA') triggerA!: NgxColorsTriggerDirective;
  @ViewChild('triggerB') triggerB!: NgxColorsTriggerDirective;

  colorA: string | null = '#ff5e5b';
  colorB: string | null = '#4dd0e1';
  colorC: string | null = '#b388ff';
  colorD: string | null = '#7ae582';
  countdown = 0;
  private countdownTimer: ReturnType<typeof setInterval> | undefined;

  ngAfterViewInit(): void {
    const auto = new URLSearchParams(window.location.search).get('auto');
    if (auto !== 'default' && auto !== 'recipe' && auto !== 'close') {
      return;
    }
    setTimeout(() => {
      this.open();
      setTimeout(() => {
        (auto === 'recipe' ? this.triggerB : this.triggerA).openPanel();
        if (auto === 'close') {
          setTimeout(() => this.close(), 150);
        }
      }, 100);
    }, 100);
  }

  open(): void {
    this.dialogRef.nativeElement.showModal();
  }

  close(): void {
    this.dialogRef.nativeElement.close();
  }

  onAutoCloseOpen(): void {
    clearInterval(this.countdownTimer);
    this.countdown = 3;
    this.countdownTimer = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        clearInterval(this.countdownTimer);
        this.close();
      }
    }, 1000);
  }

  overlayCount(): number {
    return document.getElementsByTagName('ngx-colors-overlay').length;
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownTimer);
  }
}
