import { HttpErrorResponse }                           from "@angular/common/http";
import { Injectable }                                  from "@angular/core";
import { MessageService }                              from "@coduction/primeng/api";
import { CourseDraftService, CourseMembershipService } from "@famulex/shared/famulex-api-client";
import { Actions, createEffect, ofType }               from "@ngrx/effects";
import { Store }                                       from "@ngrx/store";
import { catchError, map, of, switchMap }              from "rxjs";
import { CourseDraftEditorActions }                    from "./course-draft-editor.actions";

@Injectable()
export class CourseDraftEditorEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private courseDraftService: CourseDraftService,
    private courseMembershipService: CourseMembershipService,
    private messageService: MessageService
  ) {
  }

  /*************************************************************************
   * Load Course Draft
   ************************************************************************/
  loadCourseDraft$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftEditorActions.loadCourseDraft),
      switchMap(({ key }) => {
        if (!key) {
          return of(CourseDraftEditorActions.loadCourseDraftFailure({ routingError: true }));
        }

        return this.courseDraftService.loadCourseDraft(key).pipe(
          map(response => CourseDraftEditorActions.loadCourseDraftSuccess({ response })),
          catchError((httpError: HttpErrorResponse) => of(CourseDraftEditorActions.loadCourseDraftFailure({ routingError: false, httpError })))
        );
      })
    );
  });

  // loadFailure$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(CourseMembershipsActions.loadCourseDraftFailure)
  //   ), { dispatch: false }
  // );

}
