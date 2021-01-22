import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxColorsComponent } from './ngx-colors.component';

describe('NgxColorsComponent', () => {
  let component: NgxColorsComponent;
  let fixture: ComponentFixture<NgxColorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxColorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
