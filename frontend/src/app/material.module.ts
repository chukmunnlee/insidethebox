import { NgModule } from "@angular/core";

import { FlexLayoutModule } from '@angular/flex-layout'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import {  MatTabsModule } from '@angular/material/tabs'

const MODULES = [
  FlexLayoutModule,
  MatToolbarModule, MatButtonModule, MatIconModule, MatListModule,
  MatCardModule, MatFormFieldModule, MatInputModule, MatTabsModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MaterialModule { }
