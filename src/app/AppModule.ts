import { NgModule, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { StoreModule, combineReducers } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './AppComponent';
import { HomeComponent, HomeEffects } from './home';
import { reducers } from './reducers';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    IonicModule.forRoot(AppComponent),
    StoreModule.provideStore(reducers),
    EffectsModule.run(HomeEffects)
  ],
  bootstrap: [IonicApp],
  entryComponents: [AppComponent, HomeComponent],
  providers: []
})
export class AppModule {}
