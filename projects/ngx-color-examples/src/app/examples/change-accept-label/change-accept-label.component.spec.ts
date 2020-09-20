import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAcceptLabelExampleComponent } from './change-accept-label.component';

describe('ChangeAcceptLabelComponent', () => {
  let component: ChangeAcceptLabelExampleComponent;
  let fixture: ComponentFixture<ChangeAcceptLabelExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAcceptLabelExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAcceptLabelExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
