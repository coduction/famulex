import { Injectable, inject } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { switchMap, catchError, of } from "rxjs";
import * as NgrxTestActions from "./ngrx-test.actions";
import * as NgrxTestFeature from "./ngrx-test.reducer";

@Injectable()
export class NgrxTestEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NgrxTestActions.initNgrxTest),
      switchMap(() =>
        of(NgrxTestActions.loadNgrxTestSuccess({ ngrxTest: [] }))
      ),
      catchError((error) => {
        console.error("Error", error);
        return of(NgrxTestActions.loadNgrxTestFailure({ error }));
      })
    )
  );
}
