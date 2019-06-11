import { Component, OnInit, Input } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.scss'],
})
export class CinemaComponent implements OnInit {

  @Input('cinema') cinema: any;
  constructor(private toastCtrl: ToastController) { }

  ngOnInit() {

  }

  async buyItem(cinema){
    let toast = await this.toastCtrl.create({
      message: `Adicionado o ingresso de: ${cinema.name}`
    }); 
    toast.present();
  }

}
