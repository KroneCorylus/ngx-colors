import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTriggerExampleComponent } from './custom-trigger-example.component';

describe('CustomTriggerExampleComponent', () => {
  let component: CustomTriggerExampleComponent;
  let fixture: ComponentFixture<CustomTriggerExampleComponent>;

  beforeEach(async(() => {
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
