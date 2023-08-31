import { CourseDraft, PageCourseDraft }                     from "@famulex/shared/famulex-api-client";
import { TableMetaData }                                    from "@famulex/web/shared/table";
import { createEntityAdapter, EntityAdapter, EntityState }  from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { CourseDraftListActions }                           from "./course-draft-list.actions";
import { CourseDraftTab }                                   from "./course-draft-list.models";

export const COURSE_DRAFT_LIST_FEATURE_KEY = "CourseDraftList";

export interface State extends EntityState<CourseDraft> {
  // additional entities state properties
  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  search: string | undefined;
  activeTabKey: CourseDraftTab;

  page: PageCourseDraft | undefined;
}

export const adapter: EntityAdapter<CourseDraft> = createEntityAdapter<CourseDraft>({
  selectId: entry => entry.key,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  actionInProgress: false,

  pageIndex: 0,
  pageSize: 10,
  sortedBy: ["title,asc"],
  search: undefined,
  activeTabKey: CourseDraftTab.ALL_COURSES,

  page: undefined
});

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * Filter Tabs
   ************************************************************************/
  on(CourseDraftListActions.activateTab, CourseDraftListActions.setTab, (state, { key }) => produce(state, draft => {
    draft.activeTabKey = key;
  })),

  /*************************************************************************
   * Load CourseDrafts
   ************************************************************************/
  on(CourseDraftListActions.load, (state, { event }) => produce(state, draft => {
    draft.loading = true;

    if (event) {
      draft.pageIndex = event.pageIndex;
      draft.pageSize = event.pageSize;
      draft.sortedBy = event.sortedBy;
      draft.search = event.search ?? undefined;
    } else {
      draft.pageIndex = 0;
    }
  })),

  on(CourseDraftListActions.loadSuccess, (state, { page }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = page;
    });

    return adapter.setAll(page.content ?? [], state);
  }),

  on(CourseDraftListActions.loadFailure, state => produce(state, draft => {
    draft.loading = false;
  })),

  /*************************************************************************
   * Create CourseDraft
   ************************************************************************/
  on(CourseDraftListActions.create, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),

  on(CourseDraftListActions.createSuccess, (state, { response }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.addOne(response, state);
  }),

  on(CourseDraftListActions.createFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Update CourseDraft
   ************************************************************************/
  on(CourseDraftListActions.update, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),

  on(CourseDraftListActions.updateSuccess, (state, { update }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.updateOne(update, state);
  }),

  on(CourseDraftListActions.updateFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Single CourseDraft
   ************************************************************************/
  on(CourseDraftListActions.delete, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),

  on(CourseDraftListActions.deleteSuccess, (state, { entry }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeOne(entry.key, state);
  }),

  on(CourseDraftListActions.deleteFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Multiple CourseDrafts
   ************************************************************************/
  on(CourseDraftListActions.deleteMany, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),

  on(CourseDraftListActions.deleteManyFeedback, (state, { deletedKeys }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeMany(deletedKeys ?? [], state);
  })
);

export const CourseDraftListState = createFeature({
  name: COURSE_DRAFT_LIST_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectCourseDraftListState }) => ({
    ...adapter.getSelectors(selectCourseDraftListState),
    selectTableMetaData: createSelector(
      selectCourseDraftListState,
      (state) => ({
        loading: state.loading,
        totalEntries: state.page?.totalElements,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        sortedBy: state.sortedBy,
        search: state.search,
        activeTabKey: state.activeTabKey
      } as TableMetaData)
    )
  })
});
