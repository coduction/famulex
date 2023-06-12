import { PageUser, User }                                   from "@famulex/shared/famulex-api-client";
import { TableMetaData }                                    from "@famulex/web/shared/table";
import { createEntityAdapter, EntityAdapter, EntityState }  from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { UserActions }                                      from "./user.actions";

export const USERS_FEATURE_KEY = "Users";

export interface State extends EntityState<User> {
  // additional entities state properties
  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  globalFilter: string | undefined;

  page: PageUser | undefined;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: user => user.key,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  actionInProgress: false,

  pageIndex: 0,
  pageSize: 10,
  sortedBy: ["firstName,asc", "lastName,asc"],
  globalFilter: undefined,

  page: undefined
});

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * Load Users
   ************************************************************************/
  on(UserActions.load, (state, { event }) => produce(state, draft => {
    draft.loading = true;

    if (event) {
      draft.pageIndex = event.pageIndex;
      draft.pageSize = event.pageSize;
      draft.sortedBy = event.sortedBy;
      draft.globalFilter = event.globalFilter ?? undefined;
    }
  })),
  on(UserActions.loadSuccess, (state, { page }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = page;
    });

    return adapter.setAll(page.content ?? [], state);
  }),
  on(UserActions.loadFailure, state => produce(state, draft => {
    draft.loading = false;
  })),

  /*************************************************************************
   * Create User
   ************************************************************************/
  on(UserActions.create, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(UserActions.createSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.addOne(user, state);
  }),
  on(UserActions.createFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Update User
   ************************************************************************/
  on(UserActions.update, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(UserActions.updateSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.updateOne(user, state);
  }),
  on(UserActions.updateFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Single User
   ************************************************************************/
  on(UserActions.delete, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(UserActions.deleteSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeOne(user.key, state);
  }),
  on(UserActions.deleteFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Multiple Users
   ************************************************************************/
  on(UserActions.deleteMany, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(UserActions.deleteManyFeedback, (state, { deletedKeys }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeMany(deletedKeys ?? [], state);
  })
);

export const UserState = createFeature({
  name: USERS_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectUsersState }) => ({
    ...adapter.getSelectors(selectUsersState),
    selectTableMetaData: createSelector(
      selectUsersState,
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
