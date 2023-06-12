import { Group, PageGroup }                                 from "@famulex/shared/famulex-api-client";
import { TableMetaData }                                    from "@famulex/web/shared/table";
import { createEntityAdapter, EntityAdapter, EntityState }  from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { GroupActions }                                     from "./group.actions";

export const GROUPS_FEATURE_KEY = "Groups";

export interface State extends EntityState<Group> {
  // additional entities state properties
  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  globalFilter: string | undefined;

  page: PageGroup | null;
}

export const adapter: EntityAdapter<Group> = createEntityAdapter<Group>({
  selectId: group => group.key,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  actionInProgress: false,

  pageIndex: 0,
  pageSize: 10,
  sortedBy: ["name,asc"],
  globalFilter: undefined,

  page: null,

  selectedGroupId: null,
  selectedGroupIds: null
});

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * Load Users
   ************************************************************************/
  on(GroupActions.load, (state, { event }) => produce(state, draft => {
    draft.loading = true;

    if (event) {
      draft.pageIndex = event.pageIndex;
      draft.pageSize = event.pageSize;
      draft.sortedBy = event.sortedBy;
      draft.globalFilter = event.globalFilter ?? undefined;
    }
  })),
  on(GroupActions.loadSuccess, (state, { page }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = page;
    });

    return adapter.setAll(page.content ?? [], state);
  }),
  on(GroupActions.loadFailure, state => produce(state, draft => {
    draft.loading = false;
  })),

  /*************************************************************************
   * Create User
   ************************************************************************/
  on(GroupActions.create, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(GroupActions.createSuccess, (state, { group }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.addOne(group, state);
  }),
  on(GroupActions.createFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Update User
   ************************************************************************/
  on(GroupActions.update, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(GroupActions.updateSuccess, (state, { group }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.updateOne(group, state);
  }),
  on(GroupActions.updateFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Single User
   ************************************************************************/
  on(GroupActions.delete, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(GroupActions.deleteSuccess, (state, { group }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeOne(group.key, state);
  }),
  on(GroupActions.deleteFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Multiple Users
   ************************************************************************/
  on(GroupActions.deleteMany, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(GroupActions.deleteManyFeedback, (state, { deletedKeys }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeMany(deletedKeys ?? [], state);
  })
);

export const GroupState = createFeature({
  name: GROUPS_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectGroupsState }) => ({
    ...adapter.getSelectors(selectGroupsState),
    selectTableMetaData: createSelector(
      selectGroupsState,
      (state) => ({
        loading: state.loading,
        totalEntries: state.page?.totalElements || null,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        sortedBy: state.sortedBy,
        globalFilter: state.globalFilter
      } as TableMetaData)
    )
  })
});
