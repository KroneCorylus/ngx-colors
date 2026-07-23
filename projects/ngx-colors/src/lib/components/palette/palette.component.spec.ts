import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteComponent } from './palette.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StateService } from '../../services/state.service';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { ColorHelper } from '../../utility/color-helper';
import { ColorOption } from '../../types/color-option';

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

describe('PaletteComponent loading skeleton', () => {
  let component: PaletteComponent;
  let fixture: ComponentFixture<PaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteComponent, BrowserAnimationsModule],
      providers: [StateService],
    }).compileComponents();
    fixture = TestBed.createComponent(PaletteComponent);
    component = fixture.componentInstance;
  });

  it('clears the skeleton on first emission even if the stream never completes', () => {
    const palette$ = new BehaviorSubject<ColorOption[]>(['#ff0000']);
    component.palette$ = palette$.asObservable();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.paletteStack.peek.length).toBe(1);
  });

  it('shows the skeleton until a live stream emits for the first time', () => {
    const palette$ = new Subject<ColorOption[]>();
    component.palette$ = palette$.asObservable();
    fixture.detectChanges();

    expect(component.loading).toBeTrue();

    palette$.next(['#ff0000']);

    expect(component.loading).toBeFalse();
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
