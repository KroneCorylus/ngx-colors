import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorOption } from '../../../../ngx-colors/src/public-api';

type Usage = Record<string, { count: number; lastUsed: number }>;

const STORAGE_PREFIX = 'ngx-colors-most-used:';
const MAX_COLORS = 10;
const SEED_COLORS = [
  '#ff5e5b',
  '#ffb74d',
  '#ffed8a',
  '#7ae582',
  '#4dd0e1',
  '#68a6f8',
  '#b388ff',
  '#f06292',
];

@Injectable({ providedIn: 'root' })
export class MostUsedColorsService {
  private readonly subjects = new Map<string, BehaviorSubject<ColorOption[]>>();

  palette(key: string): Observable<ColorOption[]> {
    return this.subject(key).asObservable();
  }

  registerUse(key: string, color: string | null | undefined): void {
    if (!color) {
      return;
    }
    const usage = this.load(key);
    const normalized = color.toLowerCase();
    usage[normalized] = {
      count: (usage[normalized]?.count ?? 0) + 1,
      lastUsed: Date.now(),
    };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(usage));
    this.subject(key).next(this.toPalette(usage));
  }

  private subject(key: string): BehaviorSubject<ColorOption[]> {
    let subject = this.subjects.get(key);
    if (!subject) {
      subject = new BehaviorSubject<ColorOption[]>(
        this.toPalette(this.load(key)),
      );
      this.subjects.set(key, subject);
    }
    return subject;
  }

  private load(key: string): Usage {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PREFIX + key) ?? '{}');
    } catch {
      return {};
    }
  }

  private toPalette(usage: Usage): ColorOption[] {
    const mostUsed = Object.entries(usage)
      .sort(([, a], [, b]) => b.count - a.count || b.lastUsed - a.lastUsed)
      .slice(0, MAX_COLORS)
      .map(([color]) => color);
    const seeds = SEED_COLORS.filter(
      (seed) => !mostUsed.includes(seed),
    ).slice(0, Math.max(0, MAX_COLORS - mostUsed.length));
    return [...mostUsed, ...seeds];
  }
}
