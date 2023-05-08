import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { hot } from "jasmine-marbles";
import { Observable } from "rxjs";

import * as NgrxTestActions from "./ngrx-test.actions";
import { NgrxTestEffects } from "./ngrx-test.effects";

describe("NgrxTestEffects", () => {
  let actions: Observable<Action>;
  let effects: NgrxTestEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NgrxTestEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(NgrxTestEffects);
  });

  describe("init$", () => {
    it("should work", () => {
      actions = hot("-a-|", { a: NgrxTestActions.initNgrxTest() });

      const expected = hot("-a-|", {
        a: NgrxTestActions.loadNgrxTestSuccess({ ngrxTest: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
