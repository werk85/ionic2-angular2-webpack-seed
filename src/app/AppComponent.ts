import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { HomeComponent } from './home';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class AppComponent {
  rootPage = HomeComponent;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
}
