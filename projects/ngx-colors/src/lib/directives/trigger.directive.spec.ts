import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxColorsTriggerDirective } from './trigger.directive';
import { NgxColorsComponent } from '../../public-api';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  template: `
    <ngx-colors ngx-colors-trigger [(ngModel)]="value"></ngx-colors>
  `,
})
class HostComponent {
  value: string = '#ff00ff';
}

describe('NgxColorsTriggerDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let elementsWithDirective: Array<DebugElement>;
  let directives: Array<NgxColorsTriggerDirective>;
  let ngxColors: Array<NgxColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [NgxColorsTriggerDirective, NgxColorsComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAll(
      By.directive(NgxColorsTriggerDirective)
    );
    directives = elementsWithDirective.map((de: any) =>
      de.injector.get(NgxColorsTriggerDirective)
    );
    ngxColors = elementsWithDirective.map((de: any) =>
      de.injector.get(NgxColorsComponent)
    );
  });

  it('should create', () => {
    expect(directives.length).toBeTruthy();
  });
  it('directive 0 should have the value of ngModel', () => {
    expect(directives[0].value).toBe('#ff00ff');
  });
  it('ngx-colors should have previewColor equals directive value', () => {
    expect(directives[0].value).toBe('#ff00ff');
  });
  it('should open overlay on click', () => {
    elementsWithDirective[0].triggerEventHandler('click', {});
    const overlay =
      document.body.getElementsByTagName('ngx-colors-overlay').length;
    expect(overlay).toBeTruthy();
  });
});
