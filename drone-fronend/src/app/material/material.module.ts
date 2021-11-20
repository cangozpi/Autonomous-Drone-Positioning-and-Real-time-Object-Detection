import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

const MaterialComponents = [
  MatSliderModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
