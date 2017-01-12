import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the SearchList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var google;
@Component({
  selector: 'page-search-list',
  templateUrl: 'search-list.html'
})
export class SearchListPage {
  callback: any;
  autocompleteItems: Array<{ description: string, location: any }>;
  autocomplete;
  service = new google.maps.places.AutocompleteService();
  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone) {
    this.autocompleteItems = [];
    this.callback = this.navParams.get("callback");
    this.autocomplete = {
      query: ''
    };
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchListPage');
    var mapOptions = {
      center: { lat: 28.613939, lng: 77.209021 },
      zoom: 13,
      disableDefaultUI: true,// DISABLE MAP TYPE
      scrollwheel: false
    };
  }
  dismiss(){
    this.navCtrl.pop();
  }

  itemSelected(item){
    var geocoder = new google.maps.Geocoder();
    var service = new google.maps.places.AutocompleteService();
    var that = this;
    geocoder.geocode({ 
            'placeId': item.location
        }, 
        function(responses, status) {
            if (status == 'OK') {
                var lat = responses[0].geometry.location.lat();
                var lng = responses[0].geometry.location.lng();
                //console.log(lat, lng);
                that.callback({latitude: lat, longtitude: lng, description: item.description}).then(()=>{
                    that.navCtrl.pop();
                });
            }
    });
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: 'VN'} }, function (predictions, status) {
        me.autocompleteItems = []; 
        me.zone.run(function () {
        if (predictions == null)
        return;
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push({description: prediction.description, location: prediction.place_id});
        });
      });
    });
  }

}
