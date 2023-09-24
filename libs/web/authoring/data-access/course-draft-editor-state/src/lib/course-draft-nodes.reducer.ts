import { CourseDraftNode }                                  from "@famulex/shared/famulex-api-client";
import { createEntityAdapter, EntityState }                 from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { CourseDraftNodesActions }                          from "./course-draft-nodes.actions";
import { buildCurrentTreeNode, buildNodesTree }             from "./course-draft-nodes.helper";
import { CourseDraftActions }                               from "./course-draft.actions";

export const COURSE_DRAFT_NODES_FEATURE_KEY = "courseDraftNodes";

export interface CourseDraftNodesState extends EntityState<CourseDraftNode> {
  loading: boolean;
  actionInProgress: boolean;

  selectedKey: string | null;
}

export const courseDraftNodesAdapter = createEntityAdapter<CourseDraftNode>({
  selectId: courseDraftNode => courseDraftNode.key,
  sortComparer: false
});


const initialState: CourseDraftNodesState = courseDraftNodesAdapter.getInitialState({
  loading: false,
  actionInProgress: false,

  selectedKey: null
});

const reducer = createReducer(
  initialState,

  /*************************************************************************
   * General Actions
   ************************************************************************/
  on(CourseDraftActions.leaveEditor, () => initialState),

  on(CourseDraftNodesActions.selectNode, (state, { key }) => {
    return produce(state, draft => {
      draft.selectedKey = key;
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

  on(CourseDraftActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.loading = false;
    });
  })
);

export const CourseDraftNodesState = createFeature({
  name: COURSE_DRAFT_NODES_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectCourseDraftNodesState, selectEntities, selectSelectedKey }) => ({
    ...courseDraftNodesAdapter.getSelectors(selectCourseDraftNodesState),

    selectTree: createSelector(selectEntities, entities => buildNodesTree(entities)),
    selectCurrentTreeNode: createSelector(selectEntities, selectSelectedKey, (entities, selectedKey) => buildCurrentTreeNode(entities, selectedKey)),

    selectCurrentNode: createSelector(selectEntities, selectSelectedKey, (entities, selectedKey) => selectedKey ? entities[selectedKey] : undefined)
  })
});
