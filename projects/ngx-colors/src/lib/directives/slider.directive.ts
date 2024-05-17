import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Observable,
  Subject,
  Subscription,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  takeUntil,
  tap,
} from 'rxjs';

@Directive({
  selector: '[ngxColorsSlider]',
  standalone: true,
})
export class SliderDirective implements OnInit, OnDestroy {
  constructor(private elRef: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  mouseDown(event: MouseEvent | TouchEvent): void {
    console.log('mousedown');
    this.start(event);
  }
  @Input() handle: 'circle' | 'oval' = 'circle';
  @Output()
  change: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

  destroy$: Subject<void> = new Subject<void>();

  stop$: Observable<any> = merge(
    fromEvent<MouseEvent>(document, 'mouseup').pipe(
      tap((_) => console.log('mouseup'))
    ),
    fromEvent<TouchEvent>(document, 'touchup'),
    this.destroy$
  );

  move$: Observable<[number, number]> = merge(
    fromEvent<MouseEvent>(document, 'mousemove'),
    fromEvent<TouchEvent>(document, 'touchmove')
  ).pipe(
    map((e) => this.getCoordFromEvent(e)),
    distinctUntilChanged(
      ([prevX, prevY], [currX, currY]) => prevX === currX && prevY === currY
    ),
    takeUntil(this.stop$)
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  moveSubscription: Subscription = new Subscription();

  private start(event: MouseEvent | TouchEvent): void {
    this.change.emit(this.getCoordFromEvent(event));
    if (!this.moveSubscription.closed) {
      this.moveSubscription.unsubscribe();
    }
    this.move$.subscribe((res) => {
      console.log('mousemove', res);
      this.change.emit(res);
    });
  }

  private getCoordFromEvent(event: MouseEvent | TouchEvent): [number, number] {
    const position = this.elRef.nativeElement.getBoundingClientRect();
    const x =
      ((event as MouseEvent).pageX !== undefined
        ? (event as MouseEvent).pageX
        : (event as TouchEvent).touches[0].pageX) -
      position.left -
      window.scrollX; // Using type assertion for performance.
    const y =
      ((event as MouseEvent).pageY !== undefined
        ? (event as MouseEvent).pageY
        : (event as TouchEvent).touches[0].pageY) -
      position.top -
      window.scrollY;
    return [x, y];
  }
}
