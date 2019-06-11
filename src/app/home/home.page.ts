import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  map: any;
  dados: any[];
  automaticClose = false;
  opencinema = false;
  openfilme = false;
  
  public listaFilmes: Array<any>;
  public listaGenero: Array<any>;
  private baseURL : string = "https://api.themoviedb.org/3/";

  constructor(private geolocation: Geolocation, private http: HttpClient, public tmbdServico: Http) {
    this.http.get('assets/bdcinema.json').subscribe(res => {
      this.dados = res['itens'];
      this.dados[0].open = false;      
      this.criarMap(this.dados);    
    }); 
    this.getGenero();   
  }

  toggleOpcaoCinema (){
    this.opencinema = !this.opencinema;
  }
  toggleOpcaoFilme (){
    this.openfilme = !this.openfilme;
  }

  toggleCinema (index){
    this.dados[index].open = !this.dados[index].open;
    if (this.automaticClose && this.dados[index].open){
      this.dados
      .filter((item, itemIndex) => itemIndex != index)
      .map(item => item.open = false);      
    }
  }

  toggleItem (index, childIndex){
    this.dados[index].children[childIndex].open = !this.dados[index].children[childIndex].open;
  }

  toggleGenero (index){
    this.listaGenero[index].open = !this.listaGenero[index].open;
    if (this.automaticClose && this.listaGenero[index].open){
      this.listaGenero
      .filter((item, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  toggleFilmes (index){
    this.listaFilmes[index].open = !this.listaFilmes[index].open;
    if (this.automaticClose && this.listaFilmes[index].open){
      this.listaFilmes
      .filter((item, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  criarMap(dados: any) {
    this.geolocation.getCurrentPosition()
    .then((resp) => {
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var startPosition = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      var destinationPosition;
      const mapOptions = {      
        zoom: 9,
        center: startPosition,
      }
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);        
      new google.maps.Marker({
        position: startPosition, 
        map: this.map,
        title: 'VOCÊ',
      });        
      for (var i = 0; i < dados.length; i++) {
        for (var j = 0; j < dados[i].children.length; j++) {
          destinationPosition = new google.maps.LatLng(dados[i].children[j].latitude, dados[i].children[j].longitude);
          new google.maps.Marker({
            position: destinationPosition, 
            map: this.map,
            title: dados[i].children[j].name,
            icon: './assets/icon/movie.png'       
          });
        }
      }
      directionsDisplay.setMap(this.map);              
    }).catch((error) => {
      console.log('Erro ao recuperar sua posição', error);
    });
  }

  getGenero(){    
    this.tmbdServico.get(this.baseURL + "genre/movie/list?language=pt-BR&" + this.getApikey()).subscribe(
      data => {
        const gen = (data as any);
        const gen_json = JSON.parse(gen._body);
        this.listaGenero = gen_json.genres;        
        this.getPopularFilm();
        //console.log(this.listaGenero);
      }, error => {
        console.log(error);
      }
    )    
  }

  getPopularFilm(){    
    this.tmbdServico.get(this.baseURL + "movie/popular?" + this.getApikey()).subscribe(
      data => {
        const film = (data as any);
        const film_json = JSON.parse(film._body);
        this.listaFilmes = film_json.results;
        //console.log(this.listaFilmes);
      }, error => {
        console.log(error);
      }
    )
  }

  private getApikey() : string {
    return "api_key=3e6dab4c5064c53cbd54bf643e1e9fea";
  }

}


