import { NgModule } from '@angular/core';
import { NgxColorsComponent } from './ngx-colors.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsComponent } from './components/icons/icons.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ConverterService } from './services/converter.service';
import { SliderDirective } from './directives/slider.directive';
import { PanelComponent } from './components/panel/panel.component';
import { ComponentFactoryService } from './services/component-factory.service';



@NgModule({
  declarations: [NgxColorsComponent, IconsComponent,ColorPickerComponent, SliderDirective, PanelComponent],
  imports: [
    
    CommonModule
  ],
  providers: [ConverterService,ComponentFactoryService],
  exports: [NgxColorsComponent],
  entryComponents:[PanelComponent]
})
export class NgxColorsModule { }
