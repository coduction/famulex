import { PageUser, User }                                   from "@famulex/shared/famulex-api-client";
import { createEntityAdapter, EntityAdapter, EntityState }  from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { UserActions }                                      from "./user.actions";

export const usersFeatureKey = "users";

export interface State extends EntityState<User> {
  // additional entities state properties
  loading: boolean;
  actionInProgress: boolean;

  pageNumber: number;
  pageSize: number;
  sortedBy: string[];

  page: PageUser | null;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: user => user.key,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  actionInProgress: false,

  pageNumber: 0,
  pageSize: 10,
  sortedBy: [],

  page: null,

  selectedUserId: null,
  selectedUserIds: null
});

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * Load Users
   ************************************************************************/
  on(UserActions.loadUsers, state => produce(state, draft => {
    draft.loading = true;
  })),
  on(UserActions.loadUsersSuccess, (state, { page }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = page;
    });

    return adapter.setAll(page.content ?? [], state);
  }),
  on(UserActions.loadUsersFailure, state => produce(state, draft => {
    draft.loading = false;
  })),

  /*************************************************************************
   * Create User
   ************************************************************************/
  on(UserActions.createUser, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(UserActions.createUserSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.addOne(user, state);
  }),
  on(UserActions.createUserFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Update User
   ************************************************************************/
  on(UserActions.updateUser, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.updateOne(user, state);
  }),
  on(UserActions.updateUserFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Single User
   ************************************************************************/
  on(UserActions.deleteUser, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(UserActions.deleteUserSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeOne(user.key, state);
  }),
  on(UserActions.deleteUserFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Multiple Users
   ************************************************************************/
  on(UserActions.deleteUsers, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(UserActions.deleteUsersFeedback, (state, { deletedKeys }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeMany(deletedKeys ?? [], state);
  }),


  on(UserActions.setPagination, (state, { page, pageSize, sortedBy }) => produce(state, draft => {
    draft.pageNumber = page;
    draft.pageSize = pageSize;
    draft.sortedBy = sortedBy;
  }))
);

export const UserState = createFeature({
  name: usersFeatureKey,
  reducer,
  extraSelectors: ({ selectUsersState }) => ({
    ...adapter.getSelectors(selectUsersState),
    selectTotal: createSelector(
      selectUsersState,
      (state) => state.page?.totalElements || null
    ),
    selectPagination: createSelector(
      selectUsersState,
      (state) => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        sortedBy: state.sortedBy
      })
    )
  })
});

// TODO Alex: Create user => pagination dont show user if out of bounds if  new user is added and pagination would not show it

// export const {
//   selectIds,
//   selectEntities,
//   selectAll: selectUsers,
//   selectTotal,
//   selectLoading,
//   selectPageNumber,
//   selectPageSize,
//   selectSortedBy,
//   selectPage,
//   selectPagination
// } = UserState;
