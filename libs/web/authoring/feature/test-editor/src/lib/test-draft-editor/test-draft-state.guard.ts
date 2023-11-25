import { inject }           from "@angular/core";
import { CanActivateFn }    from "@angular/router";
import { TestDraftActions } from "@famulex/web/authoring/data-access/test-draft-editor-state";
import { Store }            from "@ngrx/store";

export const testDraftStateGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const testDraftKey = route.paramMap.get("testDraftKey");

  if (!testDraftKey) {
    return false;
  }

  store.dispatch(TestDraftActions.select({ key: testDraftKey }));

  return true;
};
