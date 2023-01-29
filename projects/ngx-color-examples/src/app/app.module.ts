import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxColorsModule } from 'projects/ngx-colors/src/public-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { CustomTriggerExampleComponent } from './examples/custom-trigger-example/custom-trigger-example.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { HideElementsExampleComponent } from './examples/hide-elements-example/hide-elements-example.component';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import { CustomPaletteExampleComponent } from './examples/custom-palette-example/custom-palette-example.component';
import { ChangeAcceptLabelExampleComponent } from './examples/change-accept-label/change-accept-label.component'
export function getHighlightLanguages() {
  return {
    typescript: () => import('highlight.js/lib/languages/typescript'),
    css: () => import('highlight.js/lib/languages/css'),
    xml: () => import('highlight.js/lib/languages/xml')
  };
}

@NgModule({
  declarations: [
    AppComponent,
    CustomTriggerExampleComponent,
    DocumentViewerComponent,
    HideElementsExampleComponent,
    CustomPaletteExampleComponent,
    ChangeAcceptLabelExampleComponent
  ],
  imports: [
    HighlightModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxColorsModule,
    MatTabsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages()
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
