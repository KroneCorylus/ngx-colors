import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HideElementsExampleComponent } from './hide-elements-example.component';

describe('HideElementsExampleComponent', () => {
  let component: HideElementsExampleComponent;
  let fixture: ComponentFixture<HideElementsExampleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HideElementsExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HideElementsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
