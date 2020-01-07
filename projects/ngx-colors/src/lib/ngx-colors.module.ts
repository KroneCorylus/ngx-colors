import { NgModule } from '@angular/core';
import { NgxColorsComponent } from './ngx-colors.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsComponent } from './components/icons/icons.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ConverterService } from './services/converter.service';
import { SliderDirective } from './directives/slider.directive';



@NgModule({
  declarations: [NgxColorsComponent, IconsComponent,ColorPickerComponent, SliderDirective],
  imports: [
    
    CommonModule,
    BrowserAnimationsModule
  ],
  providers: [ConverterService],
  exports: [NgxColorsComponent],
  entryComponents:[ColorPickerComponent]
})
export class NgxColorsModule { }
