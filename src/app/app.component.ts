import { Component, ViewChild, ElementRef } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';

declare var google;
var directionsService;
var directionsDisplay;
var service;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    
    @ViewChild(Nav) nav: Nav;
    public rootPage = HomePage;

    pages: any;

  constructor(platform: Platform, public events: Events) {
    this.pages = [
        "page 1",
        "page 2"
     ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
  menuOpened(){
      this.events.publish('menu:opened');
  }

  menuClosed(){
      this.events.publish('menu:closed');
  }
}
