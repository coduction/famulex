import { CourseDraft }                                      from "@famulex/shared/famulex-api-client";
import { CourseDraftListActions }                           from "@famulex/web/authoring/data-access/course-draft-list-state";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { CourseDraftActions }                               from "./course-draft.actions";

export const COURSE_DRAFT_FEATURE_KEY = "courseDraft";

export interface CourseDraftState {
  courseDraft: CourseDraft | undefined;
  courseDraftKey: string | undefined;
  courseDraftLoading: boolean;
}


export const initialState: CourseDraftState = {
  courseDraft: undefined,
  courseDraftKey: undefined,
  courseDraftLoading: false
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
      draft.courseDraftKey = key;
      draft.courseDraftLoading = true;
    });
  }),

  on(CourseDraftActions.loadSuccess, (state, { response }) => {
    return produce(state, draft => {
      draft.courseDraft = response;
      draft.courseDraftLoading = false;
    });
  }),

  on(CourseDraftActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.courseDraftLoading = false;
    });
  }),

  /*************************************************************************
   * Update CourseDraft
   ************************************************************************/
  on(CourseDraftListActions.updateSuccess, (state, { update }) => {
    return produce(state, draft => {
      if (draft.courseDraft?.key === update.id) {
        console.log(update);
        draft.courseDraft = {
          ...draft.courseDraft,
          ...update.changes
        };
      }
    });
  })
);

export const CourseDraftState = createFeature({
  name: COURSE_DRAFT_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectCourseDraftState }) => ({
    selectCourseDraftTitle: createSelector(selectCourseDraftState, state => state.courseDraft?.title),
    selectCourseDraftDescription: createSelector(selectCourseDraftState, state => state.courseDraft?.description),
    selectCourseDraftAuthor: createSelector(selectCourseDraftState, state => state.courseDraft?.author),
    selectCourseDraftStatus: createSelector(selectCourseDraftState, state => state.courseDraft?.status)
  })
});
