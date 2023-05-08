import { Injectable, inject } from "@angular/core";
import { select, Store, Action } from "@ngrx/store";

import * as NgrxTestActions from "./ngrx-test.actions";
import * as NgrxTestFeature from "./ngrx-test.reducer";
import * as NgrxTestSelectors from "./ngrx-test.selectors";

@Injectable()
export class NgrxTestFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(NgrxTestSelectors.selectNgrxTestLoaded));
  allNgrxTest$ = this.store.pipe(select(NgrxTestSelectors.selectAllNgrxTest));
  selectedNgrxTest$ = this.store.pipe(select(NgrxTestSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(NgrxTestActions.initNgrxTest());
  }
}
