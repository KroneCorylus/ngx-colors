import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteComponent } from './palette.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StateService } from '../../services/state.service';

describe('PaletteComponent', () => {
  let component: PaletteComponent;
  let fixture: ComponentFixture<PaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteComponent, BrowserAnimationsModule],
      providers: [StateService],
    }).compileComponents();

    fixture = TestBed.createComponent(PaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
