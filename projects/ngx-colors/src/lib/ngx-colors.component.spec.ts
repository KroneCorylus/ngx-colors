import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxColorsComponent } from './ngx-colors.component';

describe('NgxColorsComponent', () => {
  let component: NgxColorsComponent;
  let fixture: ComponentFixture<NgxColorsComponent>;

  beforeEach(async(() => {
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
