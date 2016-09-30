import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { successAction, INCREMENT } from './actions';

@Injectable()
export class HomeEffects {
  constructor(private actions$: Actions) { }

  @Effect() login$ = this.actions$
      // Listen for the 'LOGIN' action
      .ofType(INCREMENT)
      .mergeMap(() => {
        return Observable.of(successAction());
      });
}
