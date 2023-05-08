import { NgrxTestEntity } from "./ngrx-test.models";
import {
  ngrxTestAdapter,
  NgrxTestPartialState,
  initialNgrxTestState,
} from "./ngrx-test.reducer";
import * as NgrxTestSelectors from "./ngrx-test.selectors";

describe("NgrxTest Selectors", () => {
  const ERROR_MSG = "No Error Available";
  const getNgrxTestId = (it: NgrxTestEntity) => it.id;
  const createNgrxTestEntity = (id: string, name = "") =>
    ({
      id,
      name: name || `name-${id}`,
    } as NgrxTestEntity);

  let state: NgrxTestPartialState;

  beforeEach(() => {
    state = {
      ngrxTest: ngrxTestAdapter.setAll(
        [
          createNgrxTestEntity("PRODUCT-AAA"),
          createNgrxTestEntity("PRODUCT-BBB"),
          createNgrxTestEntity("PRODUCT-CCC"),
        ],
        {
          ...initialNgrxTestState,
          selectedId: "PRODUCT-BBB",
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe("NgrxTest Selectors", () => {
    it("selectAllNgrxTest() should return the list of NgrxTest", () => {
      const results = NgrxTestSelectors.selectAllNgrxTest(state);
      const selId = getNgrxTestId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe("PRODUCT-BBB");
    });

    it("selectEntity() should return the selected Entity", () => {
      const result = NgrxTestSelectors.selectEntity(state) as NgrxTestEntity;
      const selId = getNgrxTestId(result);

      expect(selId).toBe("PRODUCT-BBB");
    });

    it('selectNgrxTestLoaded() should return the current "loaded" status', () => {
      const result = NgrxTestSelectors.selectNgrxTestLoaded(state);

      expect(result).toBe(true);
    });

    it('selectNgrxTestError() should return the current "error" state', () => {
      const result = NgrxTestSelectors.selectNgrxTestError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
