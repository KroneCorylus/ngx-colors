import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteComponent } from './palette.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StateService } from '../../services/state.service';
import { of } from 'rxjs';
import { ColorHelper } from '../../utility/color-helper';

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

describe('PaletteComponent selection matching (C13)', () => {
  let component: PaletteComponent;
  let fixture: ComponentFixture<PaletteComponent>;

  function setup(palette: Array<string>) {
    component.palette$ = of(palette);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteComponent, BrowserAnimationsModule],
      providers: [StateService],
    }).compileComponents();

    fixture = TestBed.createComponent(PaletteComponent);
    component = fixture.componentInstance;
  });

  it('highlights a semi-transparent swatch written as 8-digit hex', () => {
    setup(['#e5737380']);
    component.writeValue(ColorHelper.stringToRgba('#e5737380'));
    expect(component.indexSelected).toBe(0);
  });

  it('highlights an opaque swatch even when written with an explicit ff alpha suffix', () => {
    setup(['#e57373ff']);
    component.writeValue(ColorHelper.stringToRgba('#e57373ff'));
    expect(component.indexSelected).toBe(0);
  });

  it('highlights an opaque swatch when written without an alpha suffix', () => {
    setup(['#e57373']);
    component.writeValue(ColorHelper.stringToRgba('#e57373ff'));
    expect(component.indexSelected).toBe(0);
  });
});
