import { QuestionDraft }                                    from "@famulex/shared/famulex-api-client";
import { CourseDraftActions }                               from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { createEntityAdapter, EntityState }                 from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { QuestionDraftAction }                              from "./quesiton-draft.models";
import { QuestionDraftActions }                             from "./question-draft.actions";
import { buildCurrentQuestionTreeNode, buildQuestionsTree } from "./question-draft.helper";

export const QUESTION_DRAFTS_FEATURE_KEY = "questionDrafts";

export interface QuestionDraftsState extends EntityState<QuestionDraft> {
  loading: boolean;
  actionInProgress: boolean;

  currentKey: string | null;
  actions: { [id: string]: QuestionDraftAction };
}

export const questionDraftsAdapter = createEntityAdapter<QuestionDraft>({
  selectId: courseDraftNode => courseDraftNode.key,
  sortComparer: false
});


const initialState: QuestionDraftsState = questionDraftsAdapter.getInitialState({
  loading: false,
  actionInProgress: false,

  currentKey: null,
  actions: {}
});

const reducer = createReducer(
  initialState,

  /*************************************************************************
   * General Actions
   ************************************************************************/
  on(CourseDraftActions.leaveEditor, () => initialState),

  on(QuestionDraftActions.selectQuestion, (state, { key }) => {
    return produce(state, draft => {
      draft.currentKey = key;
    });
  }),

  on(QuestionDraftActions.deselectQuestion, (state) => {
    return produce(state, draft => {
      draft.currentKey = null;
    });
  }),

  /*************************************************************************
   * Load
   ************************************************************************/
  on(QuestionDraftActions.load, (state) => {
    return produce(state, draft => {
      draft.loading = true;
    });
  }),

  on(QuestionDraftActions.loadSuccess, (state, { response }) => {
    state = produce(state, draft => {
      draft.loading = false;
    });

    return questionDraftsAdapter.setAll(response, state);
  }),

  on(QuestionDraftActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.loading = false;
    });
  }),

  /*************************************************************************
   * Create
   ************************************************************************/
  on(QuestionDraftActions.create, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = true;
    });
  }),

  on(QuestionDraftActions.createSuccess, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  on(QuestionDraftActions.createFailure, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  /*************************************************************************
   * Update
   ************************************************************************/
  on(QuestionDraftActions.update, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = true;
    });
  }),

  on(QuestionDraftActions.updateSuccess, (state, { update }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return questionDraftsAdapter.updateOne(update, state);
  }),

  on(QuestionDraftActions.updateFailure, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  /*************************************************************************
   * Delete
   ************************************************************************/
  on(QuestionDraftActions.delete, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = true;
    });
  }),

  on(QuestionDraftActions.deleteSuccess, (state, { node }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return questionDraftsAdapter.removeOne(node.key, state);
  }),

  on(QuestionDraftActions.deleteFailure, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  /*************************************************************************
   * Actions
   ************************************************************************/
  on(QuestionDraftActions.addAction, (state, { id, action }) => {
    return produce(state, draft => {
      draft.actions[id] = action;
    });
  }),

  on(QuestionDraftActions.removeAction, (state, { id }) => {
    return produce(state, draft => {
      delete draft.actions[id];
    });
  }),

  on(QuestionDraftActions.clearActions, (state) => {
    return produce(state, draft => {
      draft.actions = {};
    });
  })
);

export const QuestionDraftsState = createFeature({
  name: QUESTION_DRAFTS_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectQuestionDraftsState, selectEntities, selectCurrentKey }) => ({
    ...questionDraftsAdapter.getSelectors(selectQuestionDraftsState),

    selectTree: createSelector(selectEntities, selectCurrentKey, (entities, currentKey) => buildQuestionsTree(entities, currentKey)),
    selectCurrentTreeNode: createSelector(selectEntities, selectCurrentKey, (entities, currentKey) => buildCurrentQuestionTreeNode(entities, currentKey)),
    
    selectCurrentQuestion: createSelector(selectEntities, selectCurrentKey, (entities, currentKey) => currentKey ? entities[currentKey] : undefined),
    selectActions: createSelector(selectQuestionDraftsState, state => Object.values(state.actions)),
    selectActionsMap: createSelector(selectQuestionDraftsState, state => state.actions)
  })
});
