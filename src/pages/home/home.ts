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
    this.map.getMyLocation(function(location) {
        var msg = ["Current your location:\n",
            "latitude:" + location.latLng.lat,
            "longitude:" + location.latLng.lng,
            "speed:" + location.speed,
            "time:" + location.time,
            "bearing:" + location.bearing].join("\n");

        this.map.addMarker({
            'position': location.latLng,
            'title': msg
        }, function(marker) {
            marker.showInfoWindow();
        });
    });
  }

  setTargetLocation(){
    let markerOptions: GoogleMapsMarkerOptions = {
        position: this.map.getCameraPosition(),
        title: 'Ionic'
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
    if(this.styleIndex < this.styles.length-1){
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
                position: latLng,
                title: 'Ionic',
                icon: {
                    'url': that.styles[that.styleIndex]
                }
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
                position: latLng,
                title: 'Ionic',
                icon: {
                    'url': that.styles[that.styleIndex]
                }
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
      this.calculateBetweenPoint(this.beforePos, this.lastPos);
  }

  calculateBetweenPoint(pos1, pos2){
    var directionsService = new google.maps.DirectionsService();
    var service = new google.maps.DistanceMatrixService();
    var that = this;
    var request = {
                 origin:pos1,
                 destination:pos2,
                 travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
        var steps : Array<GoogleMapsLatLng>;
        steps = [];
        var result = response.routes[0].legs[0].steps;
        for (var element in result){
                steps.push(new GoogleMapsLatLng(result[element].start_location.lat, result[element].start_location.lng));
        }
        steps.push(new GoogleMapsLatLng(response.routes[0].legs[0].end_location.lat, response.routes[0].legs[0].end_location.lng));
        that.map.addPolyline({
                points: steps,
                'color' : '#AA00FF',
                'width': 10,
                'geodesic': true
            }, function(polyline) {
                    setTimeout(function() {
                    polyline.remove();
                    }, 3000);
            });
    }
    });
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
    });
  }

  loadMap() { 
    var that = this;
    document.addEventListener("deviceready", function() {
        let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904,-89.3809802);
        let element: HTMLElement = document.getElementById('map');
        that.map = new GoogleMap(element);
        that.map.one(GoogleMapsEvent.MAP_READY).then(() => {
            let position: CameraPosition = {
                target: latLng,
                zoom: 18,
                tilt: 30
            };
            that.map.moveCamera(position);
        });
    });
  }
}
