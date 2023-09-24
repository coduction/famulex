import { inject }                   from "@angular/core";
import { CanActivateFn }            from "@angular/router";
import { CourseDraftActions }       from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { CourseMembershipsActions } from "@famulex/web/authoring/data-access/course-memberships-state";
import { Store }                    from "@ngrx/store";

export const courseDraftStateGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const courseDraftKey = route.paramMap.get("courseDraftKey");

  if (!courseDraftKey) {
    return false;
  }

  store.dispatch(CourseDraftActions.load({ key: courseDraftKey }));
  store.dispatch(CourseMembershipsActions.setCourse({ key: courseDraftKey }));

  return true;
};
