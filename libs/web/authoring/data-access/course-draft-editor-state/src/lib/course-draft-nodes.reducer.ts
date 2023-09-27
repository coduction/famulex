import { CourseDraftNode }                                  from "@famulex/shared/famulex-api-client";
import { createEntityAdapter, EntityState }                 from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { CourseDraftNodesActions }                          from "./course-draft-nodes.actions";
import { buildCurrentTreeNode, buildNodesTree }             from "./course-draft-nodes.helper";
import { CourseDraftNodeAction }                            from "./course-draft-nodes.models";
import { CourseDraftActions }                               from "./course-draft.actions";

export const COURSE_DRAFT_NODES_FEATURE_KEY = "courseDraftNodes";

export interface CourseDraftNodesState extends EntityState<CourseDraftNode> {
  loading: boolean;
  actionInProgress: boolean;

  currentKey: string | null;
  actions: { [id: string]: CourseDraftNodeAction };
}

export const courseDraftNodesAdapter = createEntityAdapter<CourseDraftNode>({
  selectId: courseDraftNode => courseDraftNode.key,
  sortComparer: false
});


const initialState: CourseDraftNodesState = courseDraftNodesAdapter.getInitialState({
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

  on(CourseDraftNodesActions.selectNode, (state, { key }) => {
    return produce(state, draft => {
      draft.currentKey = key;
    });
  }),

  on(CourseDraftNodesActions.deselectNode, (state) => {
    return produce(state, draft => {
      draft.currentKey = null;
    });
  }),

  /*************************************************************************
   * Load
   ************************************************************************/
  on(CourseDraftNodesActions.load, (state) => {
    return produce(state, draft => {
      draft.loading = true;
    });
  }),

  on(CourseDraftNodesActions.loadSuccess, (state, { response }) => {
    state = produce(state, draft => {
      draft.loading = false;
    });

    return courseDraftNodesAdapter.setAll(response, state);
  }),

  on(CourseDraftNodesActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.loading = false;
    });
  }),

  /*************************************************************************
   * Create
   ************************************************************************/
  on(CourseDraftNodesActions.create, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = true;
    });
  }),

  on(CourseDraftNodesActions.createSuccess, (state, { response }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return courseDraftNodesAdapter.addOne(response, state);
  }),

  on(CourseDraftNodesActions.createFailure, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  /*************************************************************************
   * Update
   ************************************************************************/
  on(CourseDraftNodesActions.update, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = true;
    });
  }),

  on(CourseDraftNodesActions.updateSuccess, (state, { update }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return courseDraftNodesAdapter.updateOne(update, state);
  }),

  on(CourseDraftNodesActions.updateFailure, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  /*************************************************************************
   * Delete
   ************************************************************************/
  on(CourseDraftNodesActions.delete, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = true;
    });
  }),

  on(CourseDraftNodesActions.deleteSuccess, (state, { node }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return courseDraftNodesAdapter.removeOne(node.key, state);
  }),

  on(CourseDraftNodesActions.deleteFailure, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  /*************************************************************************
   * Actions
   ************************************************************************/
  on(CourseDraftNodesActions.addAction, (state, { id, action }) => {
    return produce(state, draft => {
      draft.actions[id] = action;
    });
  }),

  on(CourseDraftNodesActions.removeAction, (state, { id }) => {
    return produce(state, draft => {
      delete draft.actions[id];
    });
  }),

  on(CourseDraftNodesActions.clearActions, (state) => {
    return produce(state, draft => {
      draft.actions = {};
    });
  })
);

export const CourseDraftNodesState = createFeature({
  name: COURSE_DRAFT_NODES_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectCourseDraftNodesState, selectEntities, selectCurrentKey }) => ({
    ...courseDraftNodesAdapter.getSelectors(selectCourseDraftNodesState),

    selectTree: createSelector(selectEntities, selectCurrentKey, (entities, currentKey) => buildNodesTree(entities, currentKey)),
    selectCurrentTreeNode: createSelector(selectEntities, selectCurrentKey, (entities, currentKey) => buildCurrentTreeNode(entities, currentKey)),

    selectCurrentNode: createSelector(selectEntities, selectCurrentKey, (entities, currentKey) => currentKey ? entities[currentKey] : undefined),
    selectActions: createSelector(selectCourseDraftNodesState, state => Object.values(state.actions)),
    selectActionsMap: createSelector(selectCourseDraftNodesState, state => state.actions)
  })
});
