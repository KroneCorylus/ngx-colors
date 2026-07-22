import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxColorsModule } from './ngx-colors.module';

@Component({
  template: '<ngx-colors ngxColorsTrigger></ngx-colors>',
})
class NgModuleHostComponent {}

describe('NgxColorsModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxColorsModule],
      declarations: [NgModuleHostComponent],
    }).compileComponents();
  });

  it('exposes the component and directive to NgModule-based consumers', () => {
    const fixture = TestBed.createComponent(NgModuleHostComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('ngx-colors')).toBeTruthy();
  });
});
