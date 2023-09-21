import { CourseDraft }                                      from "@famulex/shared/famulex-api-client";
import { CourseDraftListActions }                           from "@famulex/web/authoring/data-access/course-draft-list-state";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { CourseDraftEditorActions }                         from "./course-draft-editor.actions";

export const COURSE_DRAFT_EDITOR_FEATURE_KEY = "courseDraftEditor";

export interface CourseDraftEditorState {
  courseDraft: CourseDraft | undefined;
  courseDraftKey: string | undefined;
  courseDraftLoading: boolean;
}


export const initialState: CourseDraftEditorState = {
  courseDraft: undefined,
  courseDraftKey: undefined,
  courseDraftLoading: false
};

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * General Actions
   ************************************************************************/
  on(CourseDraftEditorActions.leaveEditor, () => initialState),

  /*************************************************************************
   * Load CourseDraft
   ************************************************************************/
  on(CourseDraftEditorActions.loadCourseDraft, (state, { key }) => {
    return produce(state, draft => {
      draft.courseDraftKey = key;
      draft.courseDraftLoading = true;
    });
  }),

  on(CourseDraftEditorActions.loadCourseDraftSuccess, (state, { response }) => {
    return produce(state, draft => {
      draft.courseDraft = response;
      draft.courseDraftLoading = false;
    });
  }),

  on(CourseDraftEditorActions.loadCourseDraftFailure, (state) => {
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

export const CourseDraftEditorState = createFeature({
  name: COURSE_DRAFT_EDITOR_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectCourseDraftEditorState }) => ({
    selectCourseDraftTitle: createSelector(selectCourseDraftEditorState, state => state.courseDraft?.title),
    selectCourseDraftDescription: createSelector(selectCourseDraftEditorState, state => state.courseDraft?.description),
    selectCourseDraftAuthor: createSelector(selectCourseDraftEditorState, state => state.courseDraft?.author),
    selectCourseDraftStatus: createSelector(selectCourseDraftEditorState, state => state.courseDraft?.status)
  })
});
