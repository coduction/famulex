import { Action } from "@ngrx/store";

import * as NgrxTestActions from "./ngrx-test.actions";
import { NgrxTestEntity } from "./ngrx-test.models";
import {
  NgrxTestState,
  initialNgrxTestState,
  ngrxTestReducer,
} from "./ngrx-test.reducer";

describe("NgrxTest Reducer", () => {
  const createNgrxTestEntity = (id: string, name = ""): NgrxTestEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe("valid NgrxTest actions", () => {
    it("loadNgrxTestSuccess should return the list of known NgrxTest", () => {
      const ngrxTest = [
        createNgrxTestEntity("PRODUCT-AAA"),
        createNgrxTestEntity("PRODUCT-zzz"),
      ];
      const action = NgrxTestActions.loadNgrxTestSuccess({ ngrxTest });

      const result: NgrxTestState = ngrxTestReducer(
        initialNgrxTestState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe("unknown action", () => {
    it("should return the previous state", () => {
      const action = {} as Action;

      const result = ngrxTestReducer(initialNgrxTestState, action);

      expect(result).toBe(initialNgrxTestState);
    });
  });
});
