import { CourseMembership, PageCourseMembership }           from "@famulex/shared/famulex-api-client";
import { TableMetaData }                                    from "@famulex/web/shared/table";
import { createEntityAdapter, EntityState }                 from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { CourseMembershipsActions }                         from "./course-memberships.actions";

const COURSE_MEMBERSHIPS_FEATURE_KEY = "courseMemberships";

interface CourseMembershipState extends EntityState<CourseMembership> {
  courseKey: string | undefined;

  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  search: string | undefined;

  page: PageCourseMembership | undefined;
}

const membershipsAdapter = createEntityAdapter<CourseMembership>({
  selectId: membership => membership.key,
  sortComparer: false
});


const initialState: CourseMembershipState = membershipsAdapter.getInitialState({
  courseKey: undefined,
  loading: false,
  actionInProgress: false,

  pageIndex: 0,
  pageSize: 10,
  sortedBy: ["firstName,asc", "lastName,asc"],
  search: undefined,

  page: undefined
});
const reducer = createReducer(
  initialState,

  /*************************************************************************
   * General Actions
   ************************************************************************/
  on(CourseMembershipsActions.clear, () => initialState),

  on(CourseMembershipsActions.setCourse, (state, { key }) => {
    return produce(initialState, draft => {
      draft.courseKey = key;
    });
  }),

  /*************************************************************************
   * Load Memberships
   ************************************************************************/
  on(CourseMembershipsActions.load, (state, { event }) => {
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

  on(CourseMembershipsActions.loadSuccess, (state, { response }) => {
    state = produce(state, draft => {
      draft.loading = false;
      draft.page = response;
    });

    return membershipsAdapter.setAll(response.content ?? [], state);
  }),

  on(CourseMembershipsActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.loading = false;
    });
  })
);

export const CourseMembershipsState = createFeature({
  name: COURSE_MEMBERSHIPS_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectCourseMembershipsState }) => ({
    ...membershipsAdapter.getSelectors(selectCourseMembershipsState),
    selectCourseKey: createSelector(selectCourseMembershipsState, (state) => state.courseKey),
    selectTableMetaData: createSelector(selectCourseMembershipsState, (state) => ({
      loading: state.loading,
      totalEntries: state.page?.totalElements,
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      sortedBy: state.sortedBy,
      search: state.search
    } as TableMetaData))
  })
});
