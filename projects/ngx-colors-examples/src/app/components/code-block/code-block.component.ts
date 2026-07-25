import { Component, Input, OnChanges } from '@angular/core';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightTypescript(code: string): string {
  return code.replace(
    /(\/\/[^\n]*)|('(?:[^'\\]|\\.)*')|(@\w+)|\b(import|from|export|class|const|new|return|true|false)\b|(\b[\w$]+\b)(?=\s*:)|\b(\d+(?:\.\d+)?)\b/g,
    (_match, com, str, dec, kw, prop, num) => {
      if (com) return `<span class="tok-com">${com}</span>`;
      if (str) return `<span class="tok-str">${str}</span>`;
      if (dec) return `<span class="tok-dec">${dec}</span>`;
      if (kw) return `<span class="tok-kw">${kw}</span>`;
      if (prop) return `<span class="tok-prop">${prop}</span>`;
      return `<span class="tok-num">${num}</span>`;
    },
  );
}

function highlightHtml(code: string): string {
  return code.replace(
    /(&lt;\/?)([\w-]+)|("[^"]*")|([[(*#]?[\w-]+[)\]]?)(?==)/g,
    (_match, lt, tag, str, attr) => {
      if (tag) return `${lt}<span class="tok-tag">${tag}</span>`;
      if (str) return `<span class="tok-str">${str}</span>`;
      return `<span class="tok-attr">${attr}</span>`;
    },
  );
}

function highlight(code: string, language: string): string {
  const escaped = escapeHtml(code);
  if (language === 'typescript') {
    return highlightTypescript(escaped);
  }
  if (language === 'html') {
    return highlightHtml(escaped);
  }
  if (language === 'shell') {
    return escaped.replace(/^([\w-]+)/, '<span class="tok-kw">$1</span>');
  }
  return escaped;
}

@Component({
  selector: 'app-code-block',
  standalone: true,
  template: `
    <div class="gx-code">
      <div class="gx-code__bar">
        <span class="gx-code__lang">{{ language }}</span>
        <button
          type="button"
          class="gx-code__copy"
          [class.copied]="copied"
          (click)="copy()"
        >
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <pre><code [innerHTML]="highlighted"></code></pre>
    </div>
  `,
})
export class CodeBlockComponent implements OnChanges {
  @Input() code: string = '';
  @Input() language: string = 'html';
  copied = false;
  highlighted = '';

  ngOnChanges(): void {
    this.highlighted = highlight(this.code, this.language);
  }

  copy(): void {
    navigator.clipboard.writeText(this.code).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1600);
    });
  }
}
