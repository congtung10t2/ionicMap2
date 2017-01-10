import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';

declare var google;
var directionsService;
var directionsDisplay;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;

    pages: Array<{ title: string, component: any }>;
    curPos: any = undefined;
    defPos: any = undefined;

  constructor(platform: Platform) {
    this.pages = [
        { title: 'current_location', component: 1 },
        { title: 'default location', component: 2 },
        { title: 'default location 2', component: 3 },
        { title: 'calculation', component: 4 }
     ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    directionsService = new google.maps.DirectionsService();
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

        var curPos = new google.maps.Marker({
            position: latLong
        });
        curPos.setIcon('http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png');
        curPos.setMap(map);
        map.setCenter(curPos.getPosition());
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
    
      case 2:
        var latLong = new google.maps.LatLng(16.0397912, 108.2254014);

        this.defPos = new google.maps.Marker({
            position: latLong
        });
        this.defPos.setIcon('http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png');
        this.defPos.setMap(map);
        map.setCenter(this.defPos.getPosition());
        break;
      case 3:
        var latLong = new google.maps.LatLng(16.0473009,108.2230078);

        this.curPos = new google.maps.Marker({
            position: latLong
        });
        this.curPos.setIcon('http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png');
        this.curPos.setMap(map);
        map.setCenter(this.curPos.getPosition());
        break;
      default:
        if (this.defPos != undefined && this.curPos != undefined) {
            directionsDisplay = new google.maps.DirectionsRenderer();

            directionsDisplay.setMap(map);    
            var request = {
                origin:this.curPos.getPosition(),
                destination:this.defPos.getPosition(),
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
                }
            });
        } else {
          alert("marker didn't set")
        }
        break;
      
    }
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      //this.nav.setRoot(page.component);
  }
}
