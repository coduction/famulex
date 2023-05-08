import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { createReducer, on, Action } from "@ngrx/store";

import * as NgrxTestActions from "./ngrx-test.actions";
import { NgrxTestEntity } from "./ngrx-test.models";

export const NGRX_TEST_FEATURE_KEY = "ngrxTest";

export interface NgrxTestState extends EntityState<NgrxTestEntity> {
  selectedId?: string | number; // which NgrxTest record has been selected
  loaded: boolean; // has the NgrxTest list been loaded
  error?: string | null; // last known error (if any)
}

export interface NgrxTestPartialState {
  readonly [NGRX_TEST_FEATURE_KEY]: NgrxTestState;
}

export const ngrxTestAdapter: EntityAdapter<NgrxTestEntity> =
  createEntityAdapter<NgrxTestEntity>();

export const initialNgrxTestState: NgrxTestState =
  ngrxTestAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialNgrxTestState,
  on(NgrxTestActions.initNgrxTest, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(NgrxTestActions.loadNgrxTestSuccess, (state, { ngrxTest }) =>
    ngrxTestAdapter.setAll(ngrxTest, { ...state, loaded: true })
  ),
  on(NgrxTestActions.loadNgrxTestFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function ngrxTestReducer(
  state: NgrxTestState | undefined,
  action: Action
) {
  return reducer(state, action);
}
