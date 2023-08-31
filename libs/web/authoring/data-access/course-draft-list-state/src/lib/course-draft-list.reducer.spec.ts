import { initialState, reducer } from "@famulex/web/authoring/data-access/course-draft-list-state";
import { Action }                from "@ngrx/store";

describe("Course Draft List Reducer", () => {
  describe("unknown action", () => {
    it("should return the previous state", () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
