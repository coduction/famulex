import { CourseDraftItem }                  from "@famulex/shared/famulex-api-client";
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeature, createReducer, on } from "@ngrx/store";
import { produce }                          from "immer";
import { CourseDraftItemsActions }          from "./course-draft-items.actions";
import { CourseDraftNodesActions }          from "./course-draft-nodes.actions";
import { CourseDraftActions }               from "./course-draft.actions";

export const COURSE_DRAFT_ITEMS_FEATURE_KEY = "courseDraftItems";

export interface CourseDraftItemsState extends EntityState<CourseDraftItem> {
  loading: boolean;
  actionInProgress: boolean;
  uploadProgress: number | null;

  selectedKey: string | null;
}

export const courseDraftItemsAdapter = createEntityAdapter<CourseDraftItem>({
  selectId: courseDraftItem => courseDraftItem.key,
  sortComparer: (a, b) => a.position - b.position
});


const initialState: CourseDraftItemsState = courseDraftItemsAdapter.getInitialState({
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
  on(CourseDraftActions.leaveEditor, CourseDraftNodesActions.selectNode, () => initialState),

  on(CourseDraftItemsActions.selectItem, (state, { key }) => {
    return produce(state, draft => {
      draft.selectedKey = key;
    });
  }),

  /*************************************************************************
   * Load
   ************************************************************************/
  on(CourseDraftItemsActions.load, (state) => {
    return produce(state, draft => {
      draft.loading = true;
    });
  }),

  on(CourseDraftItemsActions.loadSuccess, (state, { response }) => {
    state = produce(state, draft => {
      draft.loading = false;
    });

    return courseDraftItemsAdapter.setAll(response, state);
  }),

  on(CourseDraftItemsActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.loading = false;
    });
  }),


  /*************************************************************************
   * Upload
   ************************************************************************/
  on(CourseDraftItemsActions.uploadFile, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = true;
      draft.uploadProgress = 0;
    });
  }),

  on(CourseDraftItemsActions.uploadFileSuccess, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
      draft.uploadProgress = 100;
    });
  }),

  on(CourseDraftItemsActions.uploadFileFailure, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  on(CourseDraftItemsActions.uploadFileProgress, (state, { progress }) => {
    return produce(state, draft => {
      if (progress !== undefined) {
        draft.uploadProgress = progress;
      }
    });
  }),

  /*************************************************************************
   * Delete
   ************************************************************************/
  on(CourseDraftItemsActions.deleteFilePermission, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = true;
    });
  }),

  on(CourseDraftItemsActions.deleteFilePermissionSuccess, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  }),

  on(CourseDraftItemsActions.deleteFilePermissionFailure, (state) => {
    return produce(state, draft => {
      draft.actionInProgress = false;
    });
  })
);

export const CourseDraftItemsState = createFeature({
  name: COURSE_DRAFT_ITEMS_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectCourseDraftItemsState }) => ({
    ...courseDraftItemsAdapter.getSelectors(selectCourseDraftItemsState)
  })
});
