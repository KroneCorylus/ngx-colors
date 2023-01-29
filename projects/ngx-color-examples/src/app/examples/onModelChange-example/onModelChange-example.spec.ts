import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { onModelChangeComponent } from "./hide-elements-example.component";

describe("HideElementsExampleComponent", () => {
  let component: onModelChangeComponent;
  let fixture: ComponentFixture<onModelChangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [onModelChangeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(onModelChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
