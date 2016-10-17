import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { HomeComponent } from './components';

const components = [HomeComponent];

@NgModule({
    declarations: components,
    imports: [IonicModule],
    entryComponents: components
})
export class HomeModule {}
