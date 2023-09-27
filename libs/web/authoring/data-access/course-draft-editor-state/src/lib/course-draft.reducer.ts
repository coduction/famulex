import { CourseDraft }                                      from "@famulex/shared/famulex-api-client";
import { CourseDraftListActions }                           from "@famulex/web/authoring/data-access/course-draft-list-state";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { CourseDraftActions }                               from "./course-draft.actions";

export const COURSE_DRAFT_FEATURE_KEY = "courseDraft";

export interface CourseDraftState {
  key: string | undefined;
  courseDraft: CourseDraft | undefined;

  loading: boolean;
  publishing: boolean;
}


export const initialState: CourseDraftState = {
  key: undefined,
  courseDraft: undefined,

  loading: false,
  publishing: false
};

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * General Actions
   ************************************************************************/
  on(CourseDraftActions.leaveEditor, () => initialState),

  /*************************************************************************
   * Load CourseDraft
   ************************************************************************/
  on(CourseDraftActions.load, (state, { key }) => {
    return produce(state, draft => {
      draft.key = key;
      draft.loading = true;
    });
  }),

  on(CourseDraftActions.loadSuccess, (state, { response }) => {
    return produce(state, draft => {
      draft.courseDraft = response;
      draft.loading = false;
    });
  }),

  on(CourseDraftActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.loading = false;
    });
  }),

  /*************************************************************************
   * Update
   ************************************************************************/
  on(CourseDraftListActions.updateSuccess, (state, { update }) => {
    return produce(state, draft => {
      if (draft.courseDraft?.key === update.id) {
        draft.courseDraft = {
          ...draft.courseDraft,
          ...update.changes
        };
      }
    });
  }),

  /*************************************************************************
   * Publish
   ************************************************************************/
  on(CourseDraftActions.publish, (state) => {
    return produce(state, draft => {
      draft.publishing = true;
    });
  }),

  on(CourseDraftActions.publishSuccess, (state, { response }) => {
    return produce(state, draft => {
      draft.publishing = false;
      draft.courseDraft = response;
    });
  }),

  on(CourseDraftActions.publishFailure, (state, { response }) => {
    return produce(state, draft => {
      draft.publishing = true;

      if (response) {
        draft.courseDraft = response;
      }
    });
  })
);

export const CourseDraftState = createFeature({
  name: COURSE_DRAFT_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectCourseDraftState }) => ({
    selectTitle: createSelector(selectCourseDraftState, state => state.courseDraft?.title),
    selectDescription: createSelector(selectCourseDraftState, state => state.courseDraft?.description),
    selectAuthor: createSelector(selectCourseDraftState, state => state.courseDraft?.author),
    selectStatus: createSelector(selectCourseDraftState, state => state.courseDraft?.status)
  })
});
