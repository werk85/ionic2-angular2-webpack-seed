import { NgModule, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './AppComponent';
import { HomeModule, HomeEffects } from './home';
import { getReducers } from './reducers';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    HomeModule,
    IonicModule.forRoot(AppComponent),
    StoreModule.provideStore(getReducers),
    EffectsModule.run(HomeEffects)
  ],
  bootstrap: [IonicApp],
  entryComponents: [AppComponent]
})
export class AppModule {}
