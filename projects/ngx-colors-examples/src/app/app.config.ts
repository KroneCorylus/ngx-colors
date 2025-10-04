import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { NGX_COLORS_LABELS } from '../../../ngx-colors/src/public-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    {
      provide: NGX_COLORS_LABELS,
      useValue: {
        accept: 'YEAH!',
        cancel: 'NOP',
      },
    },
  ],
};
