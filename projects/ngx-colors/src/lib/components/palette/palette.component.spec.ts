import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { PaletteComponent } from './palette.component';
import { StateService } from '../../services/state.service';
import { BehaviorSubject, Subject, delay, of } from 'rxjs';
import { ColorHelper } from '../../utility/color-helper';
import { ColorOption } from '../../types/color-option';

describe('PaletteComponent', () => {
  let component: PaletteComponent;
  let fixture: ComponentFixture<PaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteComponent],
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
      imports: [PaletteComponent],
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

  it('shows the skeleton while a delayed palette resolves, then renders it', fakeAsync(() => {
    component.palette$ = of<ColorOption[]>(['#ff0000', '#00ff00']).pipe(
      delay(500),
    );
    fixture.detectChanges();

    expect(component.loading).toBeTrue();

    tick(500);

    expect(component.loading).toBeFalse();
    expect(component.paletteStack.peek.length).toBe(2);
  }));

  it('applies later emissions of a live palette to the current stack', () => {
    const palette$ = new BehaviorSubject<ColorOption[]>(['#ff0000']);
    component.palette$ = palette$.asObservable();
    fixture.detectChanges();

    expect(component.paletteStack.peek.length).toBe(1);

    palette$.next(['#00ff00', '#0000ff', '#ff00ff']);

    expect(component.paletteStack.peek.length).toBe(3);
    expect(component.paletteStack.size).toBe(1);
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
      imports: [PaletteComponent],
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
