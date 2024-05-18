import { SliderDirective } from './slider.directive';

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <div ngxColorsSlider></div> `,
})
class HostComponent {
  value: string = '#ff00ff';
}

describe('NgxColorsSliderDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let elementsWithDirective: Array<DebugElement>;
  let directives: Array<SliderDirective>;
  let divs: Array<HTMLDivElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [SliderDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAll(
      By.directive(SliderDirective)
    );
    directives = elementsWithDirective.map((de: any) =>
      de.injector.get(SliderDirective)
    );
    divs = elementsWithDirective.map((de: any) =>
      de.injector.get(SliderDirective)
    );
  });

  it('should create', () => {
    expect(directives.length).toBeTruthy();
  });
});
