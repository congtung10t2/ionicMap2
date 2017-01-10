import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';

declare var google;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;

    pages: Array<{ title: string, component: any }>;

  constructor(platform: Platform) {
    this.pages = [
        { title: 'current_location', component: 1 },
        { title: 'default location', component: 2 }
     ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
  onFunction(numb) {
     var mapOptions = {
        center: new google.maps.LatLng(0,0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    var map = new google.maps.Map
        (document.getElementById("map"), mapOptions);
    map.setZoom(15);
    switch (numb.component) {
      case 1:
        var setCurrentPos = function(latitude, longitude){
       
        var latLong = new google.maps.LatLng(latitude, longitude);

        var marker = new google.maps.Marker({
            position: latLong
        });
        marker.setIcon('http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png');
        marker.setMap(map);
        map.setCenter(marker.getPosition());
        }
        var onMapSuccess = function (position) {
            var Latitude = position.coords.latitude;
            var Longitude = position.coords.longitude;
            setCurrentPos(Latitude, Longitude);
        }
        var onMapError =  function(error) {
            console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        }
        navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: false });
        break;
    
      default:
        map.setCenter(new google.maps.LatLng(-34.9290, 138.6010));
        break;
    }
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      //this.nav.setRoot(page.component);
  }
}
