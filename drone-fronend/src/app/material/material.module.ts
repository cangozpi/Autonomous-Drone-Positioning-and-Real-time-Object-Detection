import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {CdkAccordionModule} from '@angular/cdk/accordion';

const MaterialComponents = [
  MatSliderModule,
  CdkAccordionModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
