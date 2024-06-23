import { SliderDirective } from './slider.directive';

import { Component, DebugElement, NgZone } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThumbComponent } from '../components/thumb/thumb.component';
import { Subject } from 'rxjs';

@Component({
  template: `
    <div
      ngxColorsSlider
      style="width:100px; height:100px;"
      (change)="onChange($event)"
    >
      <ngx-colors-thumb></ngx-colors-thumb>
    </div>
  `,
})
class HostComponent {
  onChange(_: [number, number]) {}
  value: string = '#ff00ff';
}

describe('SliderDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let sliderEl: DebugElement;
  let sliderDirective: SliderDirective;
  let thumbComponent: ThumbComponent;
  let zone: NgZone;
  let pointerdown: PointerEvent;
  let pointerup: PointerEvent;
  let pointermove: PointerEvent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [SliderDirective, ThumbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    sliderEl = fixture.debugElement.query(By.directive(SliderDirective));
    sliderDirective = sliderEl.injector.get(SliderDirective);
    thumbComponent = sliderEl.query(
      By.directive(ThumbComponent)
    ).componentInstance;
    zone = TestBed.inject(NgZone);
    fixture.detectChanges();
    const bb: DOMRect = sliderEl.nativeElement.getBoundingClientRect();

    pointerdown = new PointerEvent('pointerdown', {
      clientX: bb.x + 10,
      clientY: bb.y + 10,
    });
    pointerup = new PointerEvent('pointerup', {
      clientX: bb.x + 50,
      clientY: bb.y + 25,
    });
    pointermove = new PointerEvent('pointermove', {
      clientX: bb.x + 50,
      clientY: bb.y + 25,
    });
  });

  it('should create the directive', () => {
    expect(sliderEl).toBeTruthy();
  });

  it('should set initial position style to relative', () => {
    expect(sliderEl.nativeElement.style.position).toBe('relative');
  });

  it('should set thumb position on drag', fakeAsync(() => {
    zone.runOutsideAngular(() => {
      sliderEl.nativeElement.dispatchEvent(pointerdown);
      document.dispatchEvent(pointermove);
      document.dispatchEvent(pointerup);
    });
    tick(50);
    fixture.detectChanges();
    expect(thumbComponent.elementRef.nativeElement.style.left).toBe(`50px`);
    expect(thumbComponent.elementRef.nativeElement.style.top).toBe(`25px`);
  }));

  it('should set thumb position via setThumbPosition method', () => {
    sliderDirective.setThumbPosition(0.5, 0.2);
    fixture.detectChanges();
    expect(thumbComponent.elementRef.nativeElement.style.left).toBe(`50px`);
    expect(thumbComponent.elementRef.nativeElement.style.top).toBe(`20px`);
  });

  it('should emit change event on drag', fakeAsync(() => {
    spyOn(component, 'onChange');

    zone.runOutsideAngular(() => {
      sliderEl.nativeElement.dispatchEvent(pointerdown);
      document.dispatchEvent(pointermove);
      document.dispatchEvent(pointerup);
    });
    tick(50);
    fixture.detectChanges();
    expect(component.onChange).toHaveBeenCalledWith([0.5, 0.25]);
  }));

  it('should clean up observables on destroy', () => {
    sliderDirective['destroy$'] = new Subject<void>();
    // @ts-expect-error private methods
    const spyNext = spyOn(sliderDirective.destroy$, 'next');
    // @ts-expect-error private methods
    const spyComplete = spyOn(sliderDirective.destroy$, 'complete');

    fixture.destroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
  it('should not emit after ngOnDestroy', fakeAsync(() => {
    spyOn(component, 'onChange');

    zone.runOutsideAngular(() => {
      sliderEl.nativeElement.dispatchEvent(pointerdown);
      fixture.destroy();
      document.dispatchEvent(pointermove);
      document.dispatchEvent(pointerup);
    });
    tick(50);
    fixture.detectChanges();

    expect(component.onChange).not.toHaveBeenCalled();
  }));
});
