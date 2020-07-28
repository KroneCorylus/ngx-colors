import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaletteExampleComponent } from './custom-palette-example.component';

describe('CustomPaletteExampleComponent', () => {
  let component: CustomPaletteExampleComponent;
  let fixture: ComponentFixture<CustomPaletteExampleComponent>;

  beforeEach(async(() => {
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
