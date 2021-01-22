import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomTriggerExampleComponent } from './custom-trigger-example.component';

describe('CustomTriggerExampleComponent', () => {
  let component: CustomTriggerExampleComponent;
  let fixture: ComponentFixture<CustomTriggerExampleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTriggerExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTriggerExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
