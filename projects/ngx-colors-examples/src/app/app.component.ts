import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  NgxColorsComponent,
  NgxColorsTriggerDirective,
} from '../../../ngx-colors/src/public-api';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    ReactiveFormsModule,
    FormsModule,
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
}
