import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxColorsComponent } from './ngx-colors.component';

describe('NgxColorsComponent', () => {
  let component: NgxColorsComponent;
  let fixture: ComponentFixture<NgxColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxColorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
