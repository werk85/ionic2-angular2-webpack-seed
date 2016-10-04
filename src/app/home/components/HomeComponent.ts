import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { getCounter } from '../selectors';
import { incrementAction } from '../actions';

@Component({
  templateUrl: './HomeComponent.html'
})
export class HomeComponent {
  counter$: Observable<number>;

  constructor(private store$: Store<any>) {
    this.counter$ = store$.select(getCounter);
  }

  onClick() {
    this.store$.dispatch(incrementAction());
  }
}
