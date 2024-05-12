import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxColorsComponent } from '../../../ngx-colors/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxColorsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ngx-colors-examples';
}
