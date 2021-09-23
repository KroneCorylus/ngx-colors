import { NgModule } from "@angular/core";
import { NgxColorsComponent } from "./ngx-colors.component";
import { CommonModule } from "@angular/common";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { ConverterService } from "./services/converter.service";
import { SliderDirective } from "./directives/slider.directive";
import { PanelComponent } from "./components/panel/panel.component";
import { PanelFactoryService } from "./services/panel-factory.service";
import { NgxColorsTriggerDirective } from "./directives/ngx-colors-trigger.directive";

@NgModule({
  declarations: [
    NgxColorsComponent,
    ColorPickerComponent,
    SliderDirective,
    PanelComponent,
    NgxColorsTriggerDirective,
  ],
  imports: [CommonModule],
  providers: [ConverterService, PanelFactoryService],
  exports: [NgxColorsComponent, NgxColorsTriggerDirective],
  entryComponents: [PanelComponent, ColorPickerComponent],
})
export class NgxColorsModule {}
