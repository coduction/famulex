import { PageUser, User }                                  from "@famulex/shared/famulex-api-client";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on }                               from "@ngrx/store";
import { produce }                                         from "immer";
import { CourseDraftEditorActions }                        from "./course-draft-editor.actions";

export const USERS_FEATURE_KEY = "Users";

export interface State extends EntityState<User> {
  // additional entities state properties
  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  search: string | undefined;

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
  search: undefined,

  page: undefined
});

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * Load Users
   ************************************************************************/
  on(CourseDraftEditorActions.load, (state, { event }) => produce(state, draft => {
    draft.loading = true;

    if (event) {
      draft.pageIndex = event.pageIndex;
      draft.pageSize = event.pageSize;
      draft.sortedBy = event.sortedBy;
      draft.search = event.search ?? undefined;
    }
  })),
  on(CourseDraftEditorActions.loadSuccess, (state, { page }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = page;
    });

    return adapter.setAll(page.content ?? [], state);
  }),
  on(CourseDraftEditorActions.loadFailure, state => produce(state, draft => {
    draft.loading = false;
  })),

  /*************************************************************************
   * Create User
   ************************************************************************/
  on(CourseDraftEditorActions.create, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(CourseDraftEditorActions.createSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.addOne(user, state);
  }),
  on(CourseDraftEditorActions.createFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Update User
   ************************************************************************/
  on(CourseDraftEditorActions.update, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(CourseDraftEditorActions.updateSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.updateOne(user, state);
  }),
  on(CourseDraftEditorActions.updateFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Single User
   ************************************************************************/
  on(CourseDraftEditorActions.delete, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(CourseDraftEditorActions.deleteSuccess, (state, { user }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeOne(user.key, state);
  }),
  on(CourseDraftEditorActions.deleteFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Multiple Users
   ************************************************************************/
  on(CourseDraftEditorActions.deleteMany, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(CourseDraftEditorActions.deleteManyFeedback, (state, { deletedKeys }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeMany(deletedKeys ?? [], state);
  })
);

// export const UserState = createFeature({
//   name: USERS_FEATURE_KEY,
//   reducer,
//   extraSelectors: ({ selectUsersState }) => ({
//     ...adapter.getSelectors(selectUsersState),
//     selectTableMetaData: createSelector(
//       selectUsersState,
//       (state) => ({
//         loading: state.loading,
//         totalEntries: state.page?.totalElements || null,
//         pageIndex: state.pageIndex,
//         pageSize: state.pageSize,
//         sortedBy: state.sortedBy,
//         search: state.search
//       } as TableMetaData)
//     )
//   })
// });
