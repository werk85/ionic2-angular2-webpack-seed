import { platformBrowser } from '@angular/platform-browser';

import { AppModuleNgFactory } from '../.aot/src/app/AppModule.ngfactory';

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
