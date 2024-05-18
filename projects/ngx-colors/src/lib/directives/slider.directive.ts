import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  NgZone,
  ContentChild,
} from '@angular/core';
import {
  Observable,
  Subject,
  auditTime,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  startWith,
  switchMap,
  takeUntil,
  throttleTime,
} from 'rxjs';
import { ThumbComponent } from '../components/thumb/thumb.component';

@Directive({
  selector: '[ngxColorsSlider]',
  standalone: true,
})
export class SliderDirective implements OnInit, OnDestroy {
  @Output() change: EventEmitter<[number, number]> = new EventEmitter<
    [number, number]
  >();

  destroy$: Subject<void> = new Subject<void>();

  @ContentChild(ThumbComponent) thumb: ThumbComponent | undefined;

  private pointerUp$: Observable<PointerEvent> = merge(
    fromEvent<PointerEvent>(document, 'pointerup'),
    fromEvent<PointerEvent>(document, 'pointercancel')
  );

  private pointerDown$: Observable<PointerEvent> = fromEvent<PointerEvent>(
    this.elRef.nativeElement,
    'pointerdown'
  );

  private drag$: Observable<[number, number]> = this.pointerDown$.pipe(
    switchMap((pointerDownEvent) =>
      fromEvent<PointerEvent>(document, 'pointermove').pipe(
        startWith(pointerDownEvent),
        takeUntil(this.pointerUp$)
      )
    ),
    auditTime(50),
    distinctUntilChanged((prev, curr) => {
      return prev.pageY === curr.pageY && prev.pageX === curr.pageX;
    }),
    map((event) => this.getCoordFromEvent(event)),
    takeUntil(this.destroy$)
  );
  constructor(
    private elRef: ElementRef,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.elRef.nativeElement.style.position = 'relative';
    this._ngZone.runOutsideAngular(() => {
      this.drag$.subscribe(([x, y]: [number, number]) => {
        this.setThumbPosition(x, y);
        this.change.emit(this.normalize(x, y));
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setThumbPosition(x: number, y: number): void {
    if (this.thumb) {
      if (this.thumb.apparence == 'circle') {
        this.thumb.elementRef.nativeElement.style.top = y + 'px';
      }
      this.thumb.elementRef.nativeElement.style.left = x + 'px';
    }
  }
  private getCoordFromEvent(event: PointerEvent): [number, number] {
    const position = this.elRef.nativeElement.getBoundingClientRect();
    const width = this.elRef.nativeElement.offsetWidth;
    const height = this.elRef.nativeElement.offsetHeight;
    const x = Math.max(
      0,
      Math.min(event.pageX - position.left - window.scrollX, width)
    );
    const y = Math.max(
      0,
      Math.min(event.pageY - position.top - window.scrollY, height)
    );
    return [x, y];
  }

  private normalize(x: number, y: number): [number, number] {
    const width = this.elRef.nativeElement.offsetWidth;
    const height = this.elRef.nativeElement.offsetHeight;
    return [x / width, y / height];
  }
}
