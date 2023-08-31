import { PageRole, Role }                                   from "@famulex/shared/famulex-api-client";
import { TableMetaData }                                    from "@famulex/web/shared/table";
import { createEntityAdapter, EntityAdapter, EntityState }  from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { RoleActions }                                      from "./role.actions";

export const rolesFeatureKey = "roles";

export interface State extends EntityState<Role> {
  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  search: string | undefined;

  page: PageRole | null;
}

export const adapter: EntityAdapter<Role> = createEntityAdapter<Role>({
  selectId: role => role.key,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  actionInProgress: false,

  pageIndex: 0,
  pageSize: 10,
  sortedBy: ["name,asc"],
  search: undefined,

  page: null
});

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * Load Roles
   ************************************************************************/
  on(RoleActions.load, (state, { event }) => produce(state, draft => {
    draft.loading = true;

    if (event) {
      draft.pageIndex = event.pageIndex;
      draft.pageSize = event.pageSize;
      draft.sortedBy = event.sortedBy;
      draft.search = event.search ?? undefined;
    }
  })),
  on(RoleActions.loadSuccess, (state, { page }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = page;
    });

    return adapter.setAll(page.content ?? [], state);
  }),
  on(RoleActions.loadFailure, state => produce(state, draft => {
    draft.loading = false;
  })),

  /*************************************************************************
   * Create Roles
   ************************************************************************/
  on(RoleActions.create, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(RoleActions.createSuccess, (state, { role }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.addOne(role, state);
  }),
  on(RoleActions.createFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Update User
   ************************************************************************/
  on(RoleActions.update, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(RoleActions.updateSuccess, (state, { update }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.updateOne(update, state);
  }),
  on(RoleActions.updateFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Single Role
   ************************************************************************/
  on(RoleActions.delete, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(RoleActions.deleteSuccess, (state, { role }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeOne(role.key, state);
  }),
  on(RoleActions.deleteFailure, state => produce(state, draft => {
    draft.actionInProgress = false;
  })),

  /*************************************************************************
   * Delete Multiple Roles
   ************************************************************************/
  on(RoleActions.deleteMany, state => produce(state, draft => {
    draft.actionInProgress = true;
  })),
  on(RoleActions.deleteManyFeedback, (state, { deletedKeys }) => {
    state = produce(state, draft => {
      draft.actionInProgress = false;
    });

    return adapter.removeMany(deletedKeys ?? [], state);
  })
);

export const RoleState = createFeature({
  name: rolesFeatureKey,
  reducer,
  extraSelectors: ({ selectRolesState }) => ({
    ...adapter.getSelectors(selectRolesState),
    selectTotal: createSelector(
      selectRolesState,
      (state) => state.page?.totalElements || null
    ),
    selectTableMetaData: createSelector(
      selectRolesState,
      (state) => ({
        loading: state.loading,
        totalEntries: state.page?.totalElements || null,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        sortedBy: state.sortedBy,
        search: state.search
      } as TableMetaData)
    )
  })
});
