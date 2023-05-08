import { Route }             from "@angular/router";
import { provideEffects }    from "@ngrx/effects";
import { provideState }      from "@ngrx/store";
import { NgrxTestEffects }   from "./+state/ngrx-test.effects";
import { NgrxTestFacade }    from "./+state/ngrx-test.facade";
import * as fromNgrxTest     from "./+state/ngrx-test.reducer";
import { NgrxTestComponent } from "./ngrx-test/ngrx-test.component";

export const ngrxTestRoutes: Route[] = [
  {
    path: "",
    component: NgrxTestComponent,
    providers: [
      NgrxTestFacade,
      provideState(
        fromNgrxTest.NGRX_TEST_FEATURE_KEY,
        fromNgrxTest.ngrxTestReducer
      ),
      provideEffects(NgrxTestEffects)
    ]
  }
];
