import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ColorPickerComponent,
  NgxColorsComponent,
  NgxColorsTriggerDirective,
  PanelComponent,
} from '../../../ngx-colors/src/public-api';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    ColorPickerComponent,
    ReactiveFormsModule,
    FormsModule,
    PanelComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-colors-examples';
  test: string = 'rgba(255,0,255,0.5)';
  testCtrl: FormControl<string | undefined | null> = new FormControl<
    string | undefined | null
  >('rgba(0,255,100,0.9)');

  events: Array<{ who: string; event: string; value: string | undefined }> = [];

  public onChange(value: string | undefined, who: string) {
    this.events.push({ who: who, event: 'change', value: value });
  }
  public onModelChanges(value: string | undefined, who: string) {
    this.events.push({ who: who, event: 'ngModelChange', value: value });
  }

  public changeValue() {
    this.test = '#000';
    this.testCtrl.setValue('#000');
  }
}