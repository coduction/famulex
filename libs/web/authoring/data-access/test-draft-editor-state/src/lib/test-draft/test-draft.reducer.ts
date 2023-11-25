import { PageTestDraft, TestDraft }                         from "@famulex/shared/famulex-api-client";
import { TableMetaData }                                    from "@famulex/web/shared/table";
import { createEntityAdapter, EntityState }                 from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { TestDraftActions }                                 from "./test-draft.actions";

export const TEST_DRAFTS_FEATURE_KEY = "testDrafts";

export interface TestDraftsState extends EntityState<TestDraft> {
  currentKey: string | undefined;
  currentTestDraft: TestDraft | undefined;

  loading: boolean;
  publishing: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  search: string | undefined;

  page: PageTestDraft | undefined;
}

const testDraftAdapter = createEntityAdapter<TestDraft>({
  selectId: testDraft => testDraft.key,
  sortComparer: false
});


const initialState: TestDraftsState = testDraftAdapter.getInitialState({
  currentKey: undefined,
  currentTestDraft: undefined,

  loading: false,
  publishing: false,

  pageIndex: 0,
  pageSize: 10,
  sortedBy: ["title,asc"],
  search: undefined,

  page: undefined
});

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * General Actions
   ************************************************************************/
  on(TestDraftActions.leaveEditor, () => initialState),

  /*************************************************************************
   * Select
   ************************************************************************/
  on(TestDraftActions.select, (state, { key }) => {
    return produce(state, draft => {
      draft.currentKey = key;
    });
  }),

  on(TestDraftActions.selectSuccess, (state, { response }) => {
    return produce(state, draft => {
      draft.currentTestDraft = response;
    });
  }),

  on(TestDraftActions.selectFailure, (state) => {
    return produce(state, draft => {
      draft.currentKey = undefined;
      draft.currentTestDraft = undefined;
    });
  }),

  /*************************************************************************
   * Load
   ************************************************************************/
  on(TestDraftActions.load, (state, { event }) => {
    return produce(state, draft => {
      draft.loading = true;

      if (event) {
        draft.pageIndex = event.pageIndex;
        draft.pageSize = event.pageSize;
        draft.sortedBy = event.sortedBy;
        draft.search = event.search ?? undefined;
      }
    });
  }),

  on(TestDraftActions.loadSuccess, (state, { response }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = response;
    });

    return testDraftAdapter.setAll(response.content ?? [], state);
  }),

  on(TestDraftActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.loading = false;
    });
  }),

  /*************************************************************************
   * Update
   ************************************************************************/
  on(TestDraftActions.updateSuccess, (state, { update }) => {
    return produce(state, draft => {
      if (draft.currentTestDraft?.key === update.id) {
        draft.currentTestDraft = {
          ...draft.currentTestDraft,
          ...update.changes
        };
      }
    });
  }),

  /*************************************************************************
   * Publish
   ************************************************************************/
  on(TestDraftActions.publish, (state) => {
    return produce(state, draft => {
      draft.publishing = true;
    });
  }),

  on(TestDraftActions.publishSuccess, (state, { response }) => {
    return produce(state, draft => {
      draft.publishing = false;
      draft.currentTestDraft = response;
    });
  }),

  on(TestDraftActions.publishFailure, (state, { response }) => {
    return produce(state, draft => {
      draft.publishing = true;

      if (response) {
        draft.currentTestDraft = response;
      }
    });
  })
);

export const TestDraftsState = createFeature({
  name: TEST_DRAFTS_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectTestDraftsState }) => ({
    ...testDraftAdapter.getSelectors(selectTestDraftsState),
    selectTableMetaData: createSelector(
      selectTestDraftsState,
      (state) => ({
        loading: state.loading,
        totalEntries: state.page?.totalElements,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        sortedBy: state.sortedBy,
        search: state.search
      } as TableMetaData)
    )
  })
});
