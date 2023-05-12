import { PageUser, User }                                   from "@famulex/shared/famulex-api-client";
import { createEntityAdapter, EntityAdapter, EntityState }  from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { UserActions }                                      from "./user.actions";

export const usersFeatureKey = "users";

export interface State extends EntityState<User> {
  // additional entities state properties
  loading: boolean;

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

  pageNumber: 0,
  pageSize: 10,
  sortedBy: [],

  page: null,

  selectedUserId: null,
  selectedUserIds: null
});

export const reducer = createReducer(
  initialState,
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

  // on(UserActions.addUser, state => produce(state, draft => {
  //   draft.loading = true;
  // })),
  // on(UserActions.addUserSuccess, (state, { user }) => adapter.addOne(user, state)
  // ),
  // on(UserActions.addUserFailure, state => produce(state, draft => {
  //   draft.loading = false;
  // })),
  //
  //
  // on(UserActions.upsertUser,
  //   (state, action) => adapter.upsertOne(action.user, state)
  // ),
  // on(UserActions.addUsers,
  //   (state, action) => adapter.addMany(action.users, state)
  // ),
  // on(UserActions.upsertUsers,
  //   (state, action) => adapter.upsertMany(action.users, state)
  // ),
  // on(UserActions.updateUser,
  //   (state, action) => adapter.updateOne(action.user, state)
  // ),
  // on(UserActions.updateUsers,
  //   (state, action) => adapter.updateMany(action.users, state)
  // ),
  // on(UserActions.deleteUser,
  //   (state, action) => adapter.removeOne(action.id, state)
  // ),
  // on(UserActions.deleteUsers,
  //   (state, action) => adapter.removeMany(action.ids, state)
  // ),
  // on(UserActions.loadUsers,
  //   (state, action) => adapter.setAll(action.users, state)
  // ),
  // on(UserActions.clearUsers,
  //   state => adapter.removeAll(state)
  // )
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

// TODO Create user => pagination dont show user if out of bounds if  new user is added and pagination would not show it

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
