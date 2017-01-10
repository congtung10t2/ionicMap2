import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, ModalController, NavParams } from 'ionic-angular';
import { SearchListPage } from '../search-list/search-list';

declare var google;
@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})
export class HomePage {
  searchBox: any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(public navCtrl: NavController, params: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  openFilters() {
    var that = this;
    this.navCtrl.push(SearchListPage, {
    callback: function(_params) {
          if(typeof _params == "undefined")
          return;
          var latLong = new google.maps.LatLng(_params.latitude, _params.longtitude);
          var marker = new google.maps.Marker({
            position: latLong
          });
          marker.setIcon('http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png');
          marker.setMap(that.map);
          that.map.setCenter(marker.getPosition());
          return new Promise((resolve, reject) => {
             resolve();
          });
      }
    });
  }
  loadMap() {
    var latLng = new google.maps.LatLng(16.0397912, 108.2254014);
    let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
}
