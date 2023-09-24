import { HttpErrorResponse }                           from "@angular/common/http";
import { Injectable }                                  from "@angular/core";
import { MessageService }                              from "@coduction/primeng/api";
import { CourseDraftService, CourseMembershipService } from "@famulex/shared/famulex-api-client";
import { Actions, createEffect, ofType }               from "@ngrx/effects";
import { Store }                                       from "@ngrx/store";
import { catchError, map, of, switchMap }              from "rxjs";
import { CourseDraftActions }                          from "./course-draft.actions";

@Injectable()
export class CourseDraftEffects {

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
      ofType(CourseDraftActions.load),
      switchMap(({ key }) => {
        if (!key) {
          return of(CourseDraftActions.loadFailure({ routingError: true }));
        }

        return this.courseDraftService.loadCourseDraft(key).pipe(
          map(response => CourseDraftActions.loadSuccess({ response })),
          catchError((httpError: HttpErrorResponse) => of(CourseDraftActions.loadFailure({ routingError: false, httpError })))
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
