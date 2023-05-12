import { Group, PageGroup }                                 from "@famulex/shared/famulex-api-client";
import { createEntityAdapter, EntityAdapter, EntityState }  from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { GroupActions }                                     from "./group.actions";

export const GROUPS_FEATURE_KEY = "Groups";

export interface State extends EntityState<Group> {
  // additional entities state properties
  loading: boolean;

  pageNumber: number;
  pageSize: number;
  sortedBy: string[];

  page: PageGroup | null;
}

export const adapter: EntityAdapter<Group> = createEntityAdapter<Group>({
  selectId: group => group.key,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,

  pageNumber: 0,
  pageSize: 10,
  sortedBy: [],

  page: null,

  selectedGroupId: null,
  selectedGroupIds: null
});

export const reducer = createReducer(
  initialState,
  on(GroupActions.loadGroups, state => produce(state, draft => {
    draft.loading = true;
  })),
  on(GroupActions.loadGroupsSuccess, (state, { page }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = page;
    });

    return adapter.setAll(page.content ?? [], state);
  }),
  on(GroupActions.loadGroupsFailure, state => produce(state, draft => {
    draft.loading = false;
  })),
  on(GroupActions.setPagination, (state, { page, pageSize, sortedBy }) => produce(state, draft => {
    draft.pageNumber = page;
    draft.pageSize = pageSize;
    draft.sortedBy = sortedBy;
  }))
);

export const GroupState = createFeature({
  name: GROUPS_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectGroupsState }) => ({
    ...adapter.getSelectors(selectGroupsState),
    selectTotal: createSelector(
      selectGroupsState,
      (state) => state.page?.totalElements || null
    ),
    selectPagination: createSelector(
      selectGroupsState,
      (state) => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        sortedBy: state.sortedBy
      })
    )
  })
});
