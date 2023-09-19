import { SystemInfo }                                       from "@famulex/shared/famulex-api-client";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { produce }                                          from "immer";
import { SystemInfoActions }                                from "./system-info.actions";

export const SYSTEM_INFO_FEATURE_KEY = "SystemInfo";

export interface SystemInfoState {
  systemInfo: SystemInfo;
  loading: boolean;
  logoPending: boolean;
  compactLogoPending: boolean;
}

const initialState: SystemInfoState = {
  systemInfo: {},
  loading: false,
  logoPending: false,
  compactLogoPending: false
};

export const reducer = createReducer(
  initialState,

  /*************************************************************************
   * Load System Info
   ************************************************************************/
  on(SystemInfoActions.load, (state) => {
    return produce(state, draft => {
      draft.loading = true;
    });
  }),
  on(SystemInfoActions.loadSuccess, (state, { systemInfo }) => {
    return produce(state, draft => {
      draft.systemInfo = systemInfo;
      draft.loading = false;
    });
  }),
  on(SystemInfoActions.loadFailure, (state) => {
    return produce(state, draft => {
      draft.loading = false;
    });
  }),
  /*************************************************************************
   * Compact Logo
   ************************************************************************/
  on(SystemInfoActions.uploadCompactLogo, (state) => {
    return produce(state, draft => {
      draft.compactLogoPending = true;
    });
  }),
  on(SystemInfoActions.uploadCompactLogoSuccess, (state, { compactLogoPermission }) => {
    return produce(state, draft => {
      draft.systemInfo.compactLogoUrl = compactLogoPermission.file.url;
      draft.compactLogoPending = false;
    });
  }),
  on(SystemInfoActions.uploadCompactLogoFailure, (state) => {
    return produce(state, draft => {
      draft.compactLogoPending = false;
    });
  }),
  on(SystemInfoActions.deleteCompactLogo, (state) => {
    return produce(state, draft => {
      draft.compactLogoPending = true;
    });
  }),
  on(SystemInfoActions.deleteCompactLogoSuccess, (state) => {
    return produce(state, draft => {
      draft.systemInfo.compactLogoUrl = undefined;
      draft.compactLogoPending = false;
    });
  }),
  on(SystemInfoActions.deleteCompactLogoFailure, (state) => {
    return produce(state, draft => {
      draft.compactLogoPending = false;
    });
  }),

  /*************************************************************************
   * Logo
   ************************************************************************/
  on(SystemInfoActions.uploadLogo, (state) => {
    return produce(state, draft => {
      draft.logoPending = true;
    });
  }),
  on(SystemInfoActions.uploadLogoSuccess, (state, { logoPermission }) => {
    return produce(state, draft => {
      draft.systemInfo.logoUrl = logoPermission.file.url;
      draft.logoPending = false;
    });
  }),
  on(SystemInfoActions.uploadLogoFailure, (state) => {
    return produce(state, draft => {
      draft.logoPending = false;
    });
  }),
  on(SystemInfoActions.deleteLogo, (state) => {
    return produce(state, draft => {
      draft.logoPending = true;
    });
  }),
  on(SystemInfoActions.deleteLogoSuccess, (state) => {
    return produce(state, draft => {
      draft.systemInfo.logoUrl = undefined;
      draft.logoPending = false;
    });
  }),
  on(SystemInfoActions.deleteLogoFailure, (state) => {
    return produce(state, draft => {
      draft.logoPending = false;
    });
  })
);

export const SystemInfoState = createFeature({
  name: SYSTEM_INFO_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectSystemInfoState }) => ({
    selectLogoUrl: createSelector(selectSystemInfoState, (state) => state.systemInfo.logoUrl),
    selectCompactLogoUrl: createSelector(selectSystemInfoState, (state) => state.systemInfo.compactLogoUrl)
  })
});
