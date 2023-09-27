import { inject }                                         from "@angular/core";
import { CanActivateFn }                                  from "@angular/router";
import { CourseDraftNodesActions, CourseDraftNodesState } from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { Store }                                          from "@ngrx/store";
import { firstValueFrom }                                 from "rxjs";

export const courseDraftContentGuard: CanActivateFn = async (route, state) => {
  const store = inject(Store);

  const currentNodeKey = await firstValueFrom(store.select(CourseDraftNodesState.selectCurrentKey));

  if (currentNodeKey) {
    store.dispatch(CourseDraftNodesActions.deselectNode());
  }

  return true;
};
