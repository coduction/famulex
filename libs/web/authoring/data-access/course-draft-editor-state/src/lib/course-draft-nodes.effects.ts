import { Injectable }                                      from "@angular/core";
import { Router }                                          from "@angular/router";
import { MessageService }                                  from "@coduction/primeng/api";
import { CourseDraftService, CourseMembershipService }     from "@famulex/shared/famulex-api-client";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store }                                           from "@ngrx/store";
import { catchError, map, of, switchMap }                  from "rxjs";
import { CourseDraftNodesActions }                         from "./course-draft-nodes.actions";
import { CourseDraftActions }                              from "./course-draft.actions";
import { CourseDraftState }                                from "./course-draft.reducer";

@Injectable()
export class CourseDraftNodesEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private courseDraftService: CourseDraftService,
    private courseMembershipService: CourseMembershipService,
    private messageService: MessageService
  ) {
  }

  /*************************************************************************
   * Load
   ************************************************************************/
  loadCourseDraft$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftActions.load),
      map(() => CourseDraftNodesActions.load())
    );
  });

  loadCourseDraftNodes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.load),
      concatLatestFrom(() => this.store.select(CourseDraftState.selectCourseDraftKey)),
      switchMap(([_, courseDraftKey]) => {
        if (!courseDraftKey) {
          return of(CourseDraftNodesActions.loadFailure({}));
        }

        return this.courseDraftService.loadCourseDraftNodes(courseDraftKey).pipe(
          map(response => CourseDraftNodesActions.loadSuccess({ response })),
          catchError(httpError => of(CourseDraftNodesActions.loadFailure({ httpError })))
        );
      })
    );
  });
}
