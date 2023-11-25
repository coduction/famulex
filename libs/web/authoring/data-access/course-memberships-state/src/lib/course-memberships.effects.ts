import { HttpErrorResponse }                               from "@angular/common/http";
import { Injectable }                                      from "@angular/core";
import { MessageService }                                  from "primeng/api";
import { CourseDraftService, CourseMembershipService }     from "@famulex/shared/famulex-api-client";
import { translateCourseRole }                             from "@famulex/shared/util";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store }                                           from "@ngrx/store";
import { catchError, concatMap, map, of, switchMap, tap }  from "rxjs";
import { CourseMembershipsActions }                        from "./course-memberships.actions";
import { CourseMembershipsState }                          from "./course-memberships.reducer";

@Injectable()
export class CourseMembershipsEffects {

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
  loadMemberships$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseMembershipsActions.load),
      concatLatestFrom(() => [
        this.store.select(CourseMembershipsState.selectCourseKey),
        this.store.select(CourseMembershipsState.selectTableMetaData)
      ]),
      switchMap(([_, courseKey, table]) => {
        if (!courseKey) {
          return of(CourseMembershipsActions.loadFailure({ routingError: true }));
        }

        return this.courseMembershipService.loadCourseMemberships(courseKey, table.pageIndex, table.pageSize).pipe(
          map(response => CourseMembershipsActions.loadSuccess({ response })),
          catchError((httpError: HttpErrorResponse) => of(CourseMembershipsActions.loadFailure({ routingError: false, httpError })))
        );
      })
    );
  });

  /*************************************************************************
   * Create
   ************************************************************************/
  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseMembershipsActions.create),
      concatLatestFrom(() => this.store.select(CourseMembershipsState.selectCourseKey)),
      concatMap(([{ request, callback }, courseKey]) => {
        if (!courseKey) {
          return of(CourseMembershipsActions.createFailure({ courseNotSet: true }));
        }

        return this.courseMembershipService.createCourseMembership(courseKey, request).pipe(
          map(response => CourseMembershipsActions.createSuccess({ response, callback })),
          catchError((httpError: HttpErrorResponse) => of(CourseMembershipsActions.createFailure({ httpError })))
        );
      })
    );
  });

  createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseMembershipsActions.createSuccess),
      tap(({ response, callback }) => {
        if (response.user) {
          this.messageService.add({
            severity: "success",
            summary: $localize`New ${translateCourseRole(response.role)} Added to Course`,
            detail: `${response.user.firstName} ${response.user.lastName}`
          });
        }

        if (response.group) {
          this.messageService.add({
            severity: "success",
            summary: $localize`New Group Added to Course as ${translateCourseRole(response.role)}`,
            detail: `${response.group.name}`
          });
        }

        callback?.();
      }),
      map(() => CourseMembershipsActions.load({}))
    );
  });

  createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseMembershipsActions.createFailure)
    );
  }, { dispatch: false });

  /*************************************************************************
   * Create Many
   ************************************************************************/
  // TODO - Create many course memberships at once

}
