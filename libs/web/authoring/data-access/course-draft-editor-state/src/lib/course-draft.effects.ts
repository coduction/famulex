import { HttpErrorResponse }                               from "@angular/common/http";
import { Injectable }                                      from "@angular/core";
import { MessageService }                                  from "@coduction/primeng/api";
import { CourseDraftService, CourseMembershipService }     from "@famulex/shared/famulex-api-client";
import { HttpErrorInterceptor }                            from "@famulex/shared/util";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store }                                           from "@ngrx/store";
import { catchError, map, of, switchMap, tap }             from "rxjs";
import { CourseDraftActions }                              from "./course-draft.actions";
import { CourseDraftState }                                from "./course-draft.reducer";

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
   * Load
   ************************************************************************/
  load$ = createEffect(() => {
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

  /*************************************************************************
   * Publish
   ************************************************************************/
  publish$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftActions.publish),
      concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
      switchMap(([_, courseDraftKey]) => {
        if (!courseDraftKey) {
          return of(CourseDraftActions.publishFailure({}));
        }

        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.courseDraftService.publishCourseDraft(courseDraftKey).pipe(
          map(response => CourseDraftActions.publishSuccess({ response })),
          catchError(httpError => of(CourseDraftActions.publishFailure({ httpError, response: httpError.error })))
        );
      })
    );
  });

  publishFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftActions.publishFailure),
      tap(({ httpError }) => {
        if (httpError) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Could Not Publish Course`,
            detail: $localize`Please fix all errors and publish again.`
          });
        }
      })
    );
  }, { dispatch: false });

  publishSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftActions.publishSuccess),
      tap(({ response }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`Course Published`,
          detail: `${response.title}`
        });
      })
    );
  }, { dispatch: false });

}
