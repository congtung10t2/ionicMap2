import { Component, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, ModalController, NavParams, Events } from 'ionic-angular';
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
declare var plugin;
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
  startInputModel: any;
  endInputModel: any;
  public base64Image: string;
  map: any;
  constructor(public navCtrl: NavController, params: NavParams, public http: Http, public events: Events) {
      this.styleIndex = 0;
      this.styles = [
        "http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png",
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
      ];
      var that = this;
      this.events.subscribe('menu:opened', () => {
        that.map.setClickable(false);
      });
      this.events.subscribe('menu:closed', () => {
        that.map.setClickable(true);
      });
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  get startInput(){
      return this.startInputModel;
  }

  get endInput(){
      return this.endInputModel;
  }

  currentLocation(){
    var that = this;
    this.map.getMyLocation(function(location) {
        var msg = ["Current your location:\n",
            "latitude:" + location.latLng.lat,
            "longitude:" + location.latLng.lng,
            "speed:" + location.speed,
            "time:" + location.time,
            "bearing:" + location.bearing].join("\n");
        let position: CameraPosition = {
                target: location.latLng,
                zoom: 18,
                tilt: 30
          };
        that.map.moveCamera(position);
        that.map.addMarker({
            'position': location.latLng,
            'title': msg
        }, function(marker) {
            marker.showInfoWindow();
        });
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
          that.startInputModel = _params.description;
          that.beforePos = latLng;
          let markerOptions: GoogleMapsMarkerOptions = {
                position: latLng,
                title: _params.description,
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
          that.endInputModel = _params.description;
          let markerOptions: GoogleMapsMarkerOptions = {
                position: latLng,
                title: _params.description,
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

  drawPolygon(encodedPolygon) : any {
    var precision = 5; //option
    this.map.addPolyline({
        points: plugin.google.maps.geometry.encoding.decodePath(encodedPolygon, precision),
        'color' : '#AA00FF',
        'width': 10,
        'geodesic': true
    });
  }
        

  calculateBetweenPoint(pos1, pos2){
    var service = new google.maps.DistanceMatrixService();
    var that = this;
    this.http.get("https://maps.googleapis.com/maps/api/directions/json?origin="+pos1.lat+","+pos1.lng+"&destination="+pos2.lat+","+pos2.lng+"&mode=driving&key=AIzaSyBcvJyg8uQtgxPH9lPV-criyVkb_49akXo")
        .subscribe(data => {
            var result = data.json().routes[0].legs[0].steps;
            for(var i = 0; i < result.length; i++){
                that.drawPolygon(result[i].polyline.points);
            }
        }, error => {
            console.log(JSON.stringify(error.json()));
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

  initMap(){
    let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904,-89.3809802);
    let position: CameraPosition = {
        target: latLng,
        zoom: 15
    };
    this.map.moveCamera(position);
    var evtName = GoogleMapsEvent.MAP_LONG_CLICK;
    var that = this;
    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((pos) => {
            let markerOptions: GoogleMapsMarkerOptions = {
                position: pos,
                title: "just clicked",
                icon: {
                    'url': that.styles[that.styleIndex]
                }
            };
            that.map.addMarker(markerOptions)
            .then((marker: GoogleMapsMarker) => {
                    marker.showInfoWindow();
            });
        });
  }
   
  loadMap() { 
    var that = this;
    document.addEventListener("deviceready", function() {
        let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904,-89.3809802);
        let element: HTMLElement = document.getElementById('map');
        that.map = new GoogleMap(element);
        that.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            that.initMap();
        });
    });
    
  }
  
}
