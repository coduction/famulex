import { inject }                                         from "@angular/core";
import { CanActivateFn, Router }                          from "@angular/router";
import { CourseDraftNodesActions, CourseDraftNodesState } from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                          from "@ngrx/store";
import { firstValueFrom }                                 from "rxjs";

export const courseDraftNodeContentGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const currentNodeKey = route.paramMap.get("nodeKey");

  if (!currentNodeKey) {
    return false;
  }

  store.dispatch(CourseDraftNodesActions.selectNode({ key: currentNodeKey }));

  return true;
};


export const courseDraftNodeRestoreGuard: CanActivateFn = async (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  const currentNodeKey = await firstValueFrom(store.select(CourseDraftNodesState.selectSelectedKey));

  if (!currentNodeKey) {
    return true;
  }

  return router.parseUrl(state.url + "/" + currentNodeKey);
};
