import { Routes } from '@angular/router';
import { OverviewPageComponent } from './pages/overview/overview.component';
import { ExamplesPageComponent } from './pages/examples/examples.component';
import { ApiPageComponent } from './pages/api/api.component';
import { PlaygroundPageComponent } from './pages/playground/playground.component';
import { PositioningTestComponent } from './pages/positioning-test/positioning-test.component';
import { DialogTestComponent } from './pages/dialog-test/dialog-test.component';

export const routes: Routes = [
  {
    path: '',
    component: OverviewPageComponent,
  },
  {
    path: 'examples',
    component: ExamplesPageComponent,
  },
  {
    path: 'api',
    component: ApiPageComponent,
  },
  {
    path: 'playground',
    component: PlaygroundPageComponent,
  },
  {
    path: 'positioning-test',
    component: PositioningTestComponent,
  },
  {
    path: 'dialog-test',
    component: DialogTestComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
