import { createAction, props } from "@ngrx/store";
import { NgrxTestEntity } from "./ngrx-test.models";

export const initNgrxTest = createAction("[NgrxTest Page] Init");

export const loadNgrxTestSuccess = createAction(
  "[NgrxTest/API] Load NgrxTest Success",
  props<{ ngrxTest: NgrxTestEntity[] }>()
);

export const loadNgrxTestFailure = createAction(
  "[NgrxTest/API] Load NgrxTest Failure",
  props<{ error: any }>()
);
