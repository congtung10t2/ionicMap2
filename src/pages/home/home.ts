import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, ModalController, NavParams } from 'ionic-angular';
import { SearchListPage } from '../search-list/search-list';
import {Camera, 
 ImagePicker,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 CameraPosition,
 GoogleMapsMarkerOptions,
 GoogleMapsMarker} from 'ionic-native';

declare var google;
@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})
export class HomePage {
  searchBox: any;
  styleIndex;
  styles: any;
  beforePos: any;
  lastPos: any;
  public base64Image: string;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(public navCtrl: NavController, params: NavParams) {
      this.styleIndex = 0;
      this.styles = [
        "http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png",
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
      ];
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  currentLocation(){
    var that = this;
    var setCurrentPos = function(latitude, longitude){
        var latLong = new google.maps.LatLng(latitude, longitude);
        var curPos = new google.maps.Marker({
            position: latLong
        });
        curPos.setMap(that.map);
        that.map.setCenter(curPos.getPosition());
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
  }

  setTargetLocation(){
    let markerOptions: GoogleMapsMarkerOptions = {
        position: this.map.getCameraPosition(),
        title: 'Ionic',
        icon: this.styles[this.styleIndex]
    };
    this.map.addMarker(markerOptions)
    .then((marker: GoogleMapsMarker) => {
        marker.showInfoWindow();
    });
  }

  takePicture(){
    var that = this;
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
        that.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
        console.log(err);
    });
  }

  choosePicture(){
    var that = this;
    let options = {
        maximumImagesCount: 1,
    }
    ImagePicker.getPictures(options).then((results) => {
        that.base64Image = results[0];
    }, (err) => { });
  }
  
  changeStyleOfMarker(){
    if(this.styleIndex < this.styles.length){
        this.styleIndex++;
    }
    else 
        this.styleIndex = 0;
  }

  openStart() {
    var that = this;
    this.navCtrl.push(SearchListPage, {
    callback: function(_params) {
          if(typeof _params == "undefined")
          return;
          let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(_params.latitude, _params.longtitude);
          let position: CameraPosition = {
                target: latLng,
                zoom: 18,
                tilt: 30
          };
          that.beforePos = latLng;
          let markerOptions: GoogleMapsMarkerOptions = {
                position: this.map.getCameraPosition(),
                title: 'Ionic',
                icon: this.styles[this.styleIndex]
          };
          that.map.addMarker(markerOptions)
          .then((marker: GoogleMapsMarker) => {
                marker.showInfoWindow();
          });
          that.map.moveCamera(position);
          return new Promise((resolve, reject) => {
             resolve();
          });
      }
    });
  }

  openEnd() {
    var that = this;
    this.navCtrl.push(SearchListPage, {
    callback: function(_params) {
          if(typeof _params == "undefined")
          return;
          let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(_params.latitude, _params.longtitude);
          let position: CameraPosition = {
                target: latLng,
                zoom: 18,
                tilt: 30
          };
          that.lastPos = latLng;
          let markerOptions: GoogleMapsMarkerOptions = {
                position: this.map.getCameraPosition(),
                title: 'Ionic',
                icon: this.styles[this.styleIndex]
          };
          that.map.addMarker(markerOptions)
          .then((marker: GoogleMapsMarker) => {
                marker.showInfoWindow();
          });
          that.map.moveCamera(position);
          return new Promise((resolve, reject) => {
             resolve();
          });
      }
    });
  }

  calculate(){
    //  this.calculateBetweenPoint(this.beforePos, this.lastPos);
  }

  calculateBetweenPoint(pos1, pos2){/*
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer(); 
    directionsDisplay.setMap(this.map);    
    var request = {
        origin:pos1,
        destination:pos2,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [pos1],
        destinations: [pos2],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
            var distance = response.rows[0].elements[0].distance.text;
            var duration = response.rows[0].elements[0].duration.text;
            var dvDistance = document.getElementById("distance");
            dvDistance.innerHTML = "Distance: " + distance;
            var dvDuration = document.getElementById("duration");
            dvDuration.innerHTML = "Duration: " + duration;

        } else {
        }
    });*/
  }

  loadMap() { 
    let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904,-89.3809802);
    let element: HTMLElement = document.getElementById('map');
    this.map = new GoogleMap(element);
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        let position: CameraPosition = {
            target: latLng,
            zoom: 18,
            tilt: 30
        };
        this.map.moveCamera(position);
    });
  }
}
