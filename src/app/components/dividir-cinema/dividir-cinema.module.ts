import { CinemaComponent } from '../cinema/cinema.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [CinemaComponent],
  imports: [
    CommonModule, 
    IonicModule
  ],
  exports: [CinemaComponent]
})
export class DividirCinemaModule { }
