import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatInputModule } from '@angular/material/input'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatCardModule } from '@angular/material/card'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatChipsModule } from '@angular/material/chips'
import { MatSliderModule } from '@angular/material/slider'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio'
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatDialogModule } from '@angular/material/dialog'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion'



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    NgxMatDatetimePickerModule, 
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule

  ],

  exports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    NgxMatDatetimePickerModule, 
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule


  ]
})
export class AppMaterialModule { }
