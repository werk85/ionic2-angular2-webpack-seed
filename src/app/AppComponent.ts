import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';

import { HomeComponent } from './home';

@Component({
  templateUrl: 'AppComponent.html'
})
export class AppComponent {
  rootPage: any = HomeComponent;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

}
