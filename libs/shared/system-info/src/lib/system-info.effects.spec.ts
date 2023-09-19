import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { hot } from "jasmine-marbles";
import { Observable } from "rxjs";

import * as SystemInfoActions from "./system-info.actions";
import { SystemInfoEffects } from "./system-info.effects";

describe("SystemInfoEffects", () => {
  let actions: Observable<Action>;
  let effects: SystemInfoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SystemInfoEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(SystemInfoEffects);
  });

  describe("init$", () => {
    it("should work", () => {
      actions = hot("-a-|", { a: SystemInfoActions.initSystemInfo() });

      const expected = hot("-a-|", {
        a: SystemInfoActions.loadSystemInfoSuccess({ systemInfo: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
