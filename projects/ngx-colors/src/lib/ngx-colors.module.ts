import { NgModule } from '@angular/core';
import { NgxColorsComponent } from './components/ngx-colors/ngx-colors.component';
import { NgxColorsTriggerDirective } from './directives/trigger.directive';

@NgModule({
  imports: [NgxColorsComponent, NgxColorsTriggerDirective],
  exports: [NgxColorsComponent, NgxColorsTriggerDirective],
})
export class NgxColorsModule {}
