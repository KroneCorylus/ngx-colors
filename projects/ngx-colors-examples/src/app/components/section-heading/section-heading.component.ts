import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  template: `
    <div class="gx-section-heading">
      <h2 class="gx-h3">{{ label }}</h2>
      <button
        type="button"
        class="gx-section-heading__link"
        [class.copied]="copied"
        [attr.aria-label]="'Copy link to ' + label"
        [title]="copied ? 'Link copied' : 'Copy link to this section'"
        (click)="copy()"
      >
        #
      </button>
      @if (copied) {
        <span class="gx-section-heading__toast">Link copied</span>
      }
    </div>
  `,
})
export class SectionHeadingComponent {
  @Input({ required: true }) sectionId!: string;
  @Input({ required: true }) label!: string;
  copied = false;

  copy(): void {
    const url = `${window.location.origin}${window.location.pathname}#${this.sectionId}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1600);
    });
  }
}
