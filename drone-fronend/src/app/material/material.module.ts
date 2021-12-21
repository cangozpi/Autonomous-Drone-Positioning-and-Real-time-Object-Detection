import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

/* For form*/
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


const MaterialComponents = [
  MatSliderModule,
  CdkAccordionModule,
  MatExpansionModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {}
