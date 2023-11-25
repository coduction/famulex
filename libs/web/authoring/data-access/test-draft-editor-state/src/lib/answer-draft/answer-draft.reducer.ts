import { AnswerDraft }                                      from "@famulex/shared/famulex-api-client";
import { createEntityAdapter, EntityState }                 from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { AnswerDraftActions }                               from "./answer-draft.actions";

export const ANSWER_DRAFT_FEATURE_KEY = "answerDrafts";

export interface AnswerDraftsState extends EntityState<AnswerDraft> {
  loading: boolean;
  actionInProgress: boolean;
  uploadProgress: number | null;

  selectedKey: string | null;
}

export const answerDraftsAdapter = createEntityAdapter<AnswerDraft>({
  selectId: answerDraft => answerDraft.key,
  sortComparer: (a, b) => a.position - b.position
});


const initialState: AnswerDraftsState = answerDraftsAdapter.getInitialState({
  loading: false,
  actionInProgress: false,
  uploadProgress: null,

  selectedKey: null
});

const reducer = createReducer(
  initialState,

  /*************************************************************************
   * General Actions
   ************************************************************************/

  on(AnswerDraftActions.select, (state, { key }) => {
    return produce(state, draft => {
      draft.selectedKey = key;
    });
  })
);

export const AnswerDraftsState = createFeature({
  name: ANSWER_DRAFT_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectAnswerDraftsState, selectEntities }) => ({
    ...answerDraftsAdapter.getSelectors(selectAnswerDraftsState),
    answer: (key: string) => createSelector(selectEntities, (entities) => entities[key])
  })
});
