import { Action } from "@ngrx/store";

import * as SystemInfoActions from "./system-info.actions";
import { SystemInfoEntity } from "./system-info.models";
import {
  SystemInfoState,
  initialSystemInfoState,
  systemInfoReducer,
} from "./system-info.reducer";

describe("SystemInfo Reducer", () => {
  const createSystemInfoEntity = (id: string, name = ""): SystemInfoEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe("valid SystemInfo actions", () => {
    it("loadSystemInfoSuccess should return the list of known SystemInfo", () => {
      const systemInfo = [
        createSystemInfoEntity("PRODUCT-AAA"),
        createSystemInfoEntity("PRODUCT-zzz"),
      ];
      const action = SystemInfoActions.loadSystemInfoSuccess({ systemInfo });

      const result: SystemInfoState = systemInfoReducer(
        initialSystemInfoState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe("unknown action", () => {
    it("should return the previous state", () => {
      const action = {} as Action;

      const result = systemInfoReducer(initialSystemInfoState, action);

      expect(result).toBe(initialSystemInfoState);
    });
  });
});
