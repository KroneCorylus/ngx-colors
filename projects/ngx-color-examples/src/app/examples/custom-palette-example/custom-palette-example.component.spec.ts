import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomPaletteExampleComponent } from './custom-palette-example.component';

describe('CustomPaletteExampleComponent', () => {
  let component: CustomPaletteExampleComponent;
  let fixture: ComponentFixture<CustomPaletteExampleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomPaletteExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPaletteExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
