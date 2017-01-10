import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController } from 'ionic-angular';

declare var google;
@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(public navCtrl: NavController) {
    
  }
  ionViewDidLoad() {
      this.loadMap();
  }
  
  loadMap() {
    let latLng = new google.maps.LatLng(16.0397912, 108.2254014);
    let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
}
