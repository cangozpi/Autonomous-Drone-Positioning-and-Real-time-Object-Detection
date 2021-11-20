import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';

/* For form*/
import { ReactiveFormsModule } from '@angular/forms';


const MaterialComponents = [
  MatSliderModule,
  CdkAccordionModule,
  MatExpansionModule,
  MatFormFieldModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {}
