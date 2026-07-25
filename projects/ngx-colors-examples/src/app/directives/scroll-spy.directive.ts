import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appScrollSpy]',
  standalone: true,
})
export class ScrollSpyDirective implements AfterViewInit, OnDestroy {
  private frame = 0;
  private links: { el: HTMLAnchorElement; id: string }[] = [];
  private readonly onScroll = (): void => this.schedule();

  constructor(
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    this.links = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLAnchorElement>(
        'a[href^="#"]',
      ),
    ).map((el) => ({
      el,
      id: decodeURIComponent(el.getAttribute('href')!.slice(1)),
    }));

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
    });
    this.update();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    cancelAnimationFrame(this.frame);
  }

  private schedule(): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.update());
  }

  private update(): void {
    const line = 100;
    let currentId = this.links[0]?.id ?? '';
    for (const link of this.links) {
      const section = document.getElementById(link.id);
      if (section && section.getBoundingClientRect().top - line <= 0) {
        currentId = link.id;
      }
    }

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;
    if (atBottom && this.links.length) {
      currentId = this.links[this.links.length - 1].id;
    }

    for (const link of this.links) {
      link.el.classList.toggle('active', link.id === currentId);
    }
  }
}
