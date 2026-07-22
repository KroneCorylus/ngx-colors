import { Routes } from '@angular/router';
import { PlaygroundPageComponent } from './pages/playground/playground.component';
import { PositioningTestComponent } from './pages/positioning-test/positioning-test.component';

export const routes: Routes = [
  {
    path: '',
    component: PlaygroundPageComponent,
  },
  {
    path: 'positioning-test',
    component: PositioningTestComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
