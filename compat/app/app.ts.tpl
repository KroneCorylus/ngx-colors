import { Component, VERSION } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgxColorsModule],
  templateUrl: '__TEMPLATE_URL__',
  styles: [
    `
      :host {
        display: block;
        font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
        color: #0f172a;
        background: #f8fafc;
        min-height: 100vh;
        padding: 2rem 1.5rem 4rem;
      }
      header {
        max-width: 60rem;
        margin: 0 auto 2rem;
      }
      h1 {
        font-size: 1.5rem;
        margin: 0 0 0.5rem;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 0.8rem;
      }
      .badge {
        background: #0f172a;
        color: #fff;
        border-radius: 999px;
        padding: 0.25rem 0.75rem;
      }
      .badge.alt {
        background: #e2e8f0;
        color: #0f172a;
      }
      .grid {
        max-width: 60rem;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
        gap: 1rem;
      }
      .card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1rem;
      }
      .card h2 {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin: 0 0 0.75rem;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .value {
        font-family: ui-monospace, monospace;
        font-size: 0.8rem;
        color: #475569;
        word-break: break-all;
      }
      .events {
        max-width: 60rem;
        margin: 1.5rem auto 0;
      }
      .events ul {
        list-style: none;
        margin: 0;
        padding: 0;
        font-family: ui-monospace, monospace;
        font-size: 0.75rem;
        color: #475569;
      }
      .events li {
        padding: 0.2rem 0;
        border-bottom: 1px solid #f1f5f9;
      }
      .empty {
        color: #94a3b8;
      }
    `,
  ],
})
export class __CLASS__ {
  readonly angularVersion = VERSION.full;

  basic: string | undefined = '#0ea5e9';
  hsla: string | undefined = 'hsla(280, 80%, 60%, 0.75)';
  opaque: string | undefined = '#22c55e';
  fromPalette: string | undefined = '#ef4444';
  paged: string | undefined = 'rgba(99, 102, 241, 0.9)';
  disabledColor: string | undefined = '#64748b';
  dark: string | undefined = '#f59e0b';
  confirmed: string | undefined = '#14b8a6';

  readonly palette: string[] = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#0ea5e9',
    '#6366f1',
    '#a855f7',
    '#ec4899',
  ];

  events: string[] = [];

  log(name: string, value: unknown): void {
    this.events = [`${name} → ${JSON.stringify(value)}`, ...this.events].slice(
      0,
      12,
    );
  }
}
