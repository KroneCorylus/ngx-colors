import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxColorsComponent } from './ngx-colors.component';
import { NgxColorsTriggerDirective } from '../../directives/trigger.directive';
import { NGX_COLORS_CONFIG } from '../../interfaces/configuration';

@Component({
  template: ` <ngx-colors ngxColorsTrigger [(ngModel)]="value"></ngx-colors> `,
})
class HostComponent {
  value: string | null = '#ff00ff';
}

function getNgxColors(
  fixture: ComponentFixture<HostComponent>,
): NgxColorsComponent {
  return fixture.debugElement.query(By.directive(NgxColorsComponent))
    .componentInstance;
}

describe('NgxColorsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [NgxColorsTriggerDirective, NgxColorsComponent, FormsModule],
      providers: [{ provide: NGX_COLORS_CONFIG, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('shows the initial bound value as its preview, with no prior change needed', () => {
    expect(getNgxColors(fixture).previewColor).toBe('rgb(255, 0, 255)');
  });

  it('updates the preview when the value changes', fakeAsync(() => {
    fixture.componentInstance.value = '#0000ff';
    fixture.detectChanges();
    tick();
    expect(getNgxColors(fixture).previewColor).toBe('rgb(0, 0, 255)');
  }));

  it('shows no preview color when the value is null', fakeAsync(() => {
    fixture.componentInstance.value = null;
    fixture.detectChanges();
    tick();
    expect(getNgxColors(fixture).previewColor).toBeFalsy();
  }));
});

describe('NgxColorsComponent with outputModel: CMYK', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [NgxColorsTriggerDirective, NgxColorsComponent, FormsModule],
      providers: [
        { provide: NGX_COLORS_CONFIG, useValue: { outputModel: 'CMYK' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders a CSS-safe RGB preview instead of the CMYK output string', () => {
    const preview = getNgxColors(fixture).previewColor;
    expect(preview).toBe('rgb(255, 0, 255)');
    expect(preview?.startsWith('cmyk')).toBe(false);
  });
});

describe('NgxColorsComponent with outputModel: HSVA', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [NgxColorsTriggerDirective, NgxColorsComponent, FormsModule],
      providers: [
        { provide: NGX_COLORS_CONFIG, useValue: { outputModel: 'HSVA' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders a CSS-safe RGB preview instead of the HSVA output string', () => {
    const preview = getNgxColors(fixture).previewColor;
    expect(preview).toBe('rgb(255, 0, 255)');
    expect(preview?.startsWith('hsv')).toBe(false);
  });
});
