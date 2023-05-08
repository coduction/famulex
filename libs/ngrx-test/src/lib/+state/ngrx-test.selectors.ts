import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  NGRX_TEST_FEATURE_KEY,
  NgrxTestState,
  ngrxTestAdapter,
} from "./ngrx-test.reducer";

// Lookup the 'NgrxTest' feature state managed by NgRx
export const selectNgrxTestState = createFeatureSelector<NgrxTestState>(
  NGRX_TEST_FEATURE_KEY
);

const { selectAll, selectEntities } = ngrxTestAdapter.getSelectors();

export const selectNgrxTestLoaded = createSelector(
  selectNgrxTestState,
  (state: NgrxTestState) => state.loaded
);

export const selectNgrxTestError = createSelector(
  selectNgrxTestState,
  (state: NgrxTestState) => state.error
);

export const selectAllNgrxTest = createSelector(
  selectNgrxTestState,
  (state: NgrxTestState) => selectAll(state)
);

export const selectNgrxTestEntities = createSelector(
  selectNgrxTestState,
  (state: NgrxTestState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectNgrxTestState,
  (state: NgrxTestState) => state.selectedId
);

export const selectEntity = createSelector(
  selectNgrxTestEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
