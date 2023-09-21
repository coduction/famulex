import { HttpErrorResponse }                                                  from "@angular/common/http";
import { Injectable }                                                         from "@angular/core";
import { MessageService }                                                     from "@coduction/primeng/api";
import { CourseDraftService }                                                 from "@famulex/shared/famulex-api-client";
import { AuthService }                                                        from "@famulex/shared/security/util";
import { HttpErrorInterceptor }                                               from "@famulex/shared/util";
import { Actions, concatLatestFrom, createEffect, ofType }                    from "@ngrx/effects";
import { Store }                                                              from "@ngrx/store";
import { catchError, concatMap, forkJoin, map, mergeMap, of, switchMap, tap } from "rxjs";
import { CourseDraftListActions }                                             from "./course-draft-list.actions";
import { CourseDraftTab }                                                     from "./course-draft-list.models";
import { CourseDraftListState }                                               from "./course-draft-list.reducer";

@Injectable()
export class CourseDraftListEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private courseDraftService: CourseDraftService,
    private messageService: MessageService,
    private authService: AuthService // TODO Alex: Refactor this and put auth data into a separate state
  ) {
  }

  /*************************************************************************
   * Activate Tab
   ************************************************************************/
  activateTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseDraftListActions.activateTab),
      map(() => CourseDraftListActions.load({}))
    )
  );

  /*************************************************************************
   * Load
   ************************************************************************/
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseDraftListActions.load),
      concatLatestFrom(() => this.store.select(CourseDraftListState.selectTableMetaData)),
      switchMap(([_, table]) => {
          HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

          const myCourses = table.activeTabKey === CourseDraftTab.MY_COURSES;

          return this.courseDraftService.loadCourseDrafts(table.pageIndex, table.pageSize, table.sortedBy, table.search, myCourses).pipe(
            map(page => CourseDraftListActions.loadSuccess({ page })),
            catchError((error: HttpErrorResponse) => of(CourseDraftListActions.loadFailure({ error })))
          );
        }
      )
    )
  );

  loadFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseDraftListActions.loadFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while loading courses.`,
          detail: $localize`Please try again later and reload the page.`
        });
      })
    ), { dispatch: false }
  );

  /*************************************************************************
   * Create
   ************************************************************************/
  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.create),
      concatMap(({ request, dialog }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        if (dialog) {
          dialog.buttons?.forEach(button => button.disabled = true);

          if (dialog.activeButton) {
            dialog.activeButton.loading = true;
          }
        }

        return this.courseDraftService.createCourseDraft(request).pipe(
          map(response => CourseDraftListActions.createSuccess({ response, dialog })),
          catchError((error: HttpErrorResponse) => of(CourseDraftListActions.createFailure({ error, dialog })))
        );
      })
    );
  });

  createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.createFailure),
      tap(({ error, dialog }) => {
        if (dialog) {
          if (dialog.activeButton) {
            dialog.activeButton.loading = false;
          }

          dialog.buttons?.forEach(button => button.disabled = false);
        }

        this.messageService.add({
          severity: "error",
          summary: $localize`Course could not be created.`,
          detail: $localize`Please try again later.`
        });
      })
    );
  }, { dispatch: false });

  createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.createSuccess),
      tap(({ response, dialog }) => {
        if (dialog) {
          dialog.dialogRef?.close();
        }

        this.messageService.add({
          severity: "success",
          summary: $localize`New course created.`,
          detail: `${response.title}`
        });
      }),
      concatMap(() => [
        //WizardActions.finishSuccess({ id: USER_EDIT_WIZARD_ID }),
        CourseDraftListActions.load({})
      ])
    );
  });

  /*************************************************************************
   * Update
   ************************************************************************/
  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.update),
      concatMap(({ key, request, dialog }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        if (dialog) {
          dialog.buttons?.forEach(button => button.disabled = true);

          if (dialog.activeButton) {
            dialog.activeButton.loading = true;
          }
        }

        return this.courseDraftService.updateCourseDraft(key, request).pipe(
          map(response => CourseDraftListActions.updateSuccess({ update: { id: key, changes: response }, dialog })),
          catchError((error: HttpErrorResponse) => of(CourseDraftListActions.updateFailure({ error, dialog })))
        );
      })
    );
  });

  updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.updateFailure),
      tap(({ error, dialog }) => {
        if (dialog) {
          if (dialog.activeButton) {
            dialog.activeButton.loading = false;
          }

          dialog.buttons?.forEach(button => button.disabled = false);
        }

        this.messageService.add({
          severity: "error",
          summary: $localize`Course could not be updated`,
          detail: $localize`Please try again later.`
        });
      })
    );
  }, { dispatch: false });

  updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.updateSuccess),
      tap(({ update, dialog }) => {
        if (dialog) {
          dialog.dialogRef?.close();
        }

        this.messageService.add({
          severity: "success",
          summary: $localize`Course Updated`
        });
      }),
      map(() => CourseDraftListActions.load({}))
    );
  });

  /*************************************************************************
   * Delete Single
   ************************************************************************/
  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.delete),
      mergeMap(({ entry }) => {
        return this.courseDraftService.deleteCourseDraft(entry.key).pipe(
          map(() => CourseDraftListActions.deleteSuccess({ entry })),
          catchError((error: HttpErrorResponse) => of(CourseDraftListActions.deleteFailure({ error })))
        );
      })
    );
  });

  deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.deleteSuccess),
      tap(({ entry }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`Course Deleted`,
          detail: `${entry.title}`
        });
      }),
      map(() => CourseDraftListActions.load({}))
    );
  });

  deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.deleteFailure),
      tap(({ error }) => {
        // TODO: Error handling
      })
    );
  }, { dispatch: false });

  /*************************************************************************
   * Delete Multiple
   ************************************************************************/
  deleteMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.deleteMany),
      mergeMap(({ keys }) => {
        const deletedKeys: string[] = [];
        const errorKeys: string[] = [];

        const requests = keys.map(key => {
          return this.courseDraftService.deleteCourseDraft(key).pipe(
            tap(() => deletedKeys.push(key)),
            catchError(error => {
              errorKeys.push(key);
              return of(error);
            })
          );
        });

        return forkJoin(requests).pipe(
          map(() => CourseDraftListActions.deleteManyFeedback({ deletedKeys, errorKeys }))
        );
      })
    );
  });

  deleteManyFeedback$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftListActions.deleteManyFeedback),
      tap(({ error, deletedKeys, errorKeys }) => {
        if (deletedKeys && deletedKeys.length > 0) {
          this.messageService.add({
            severity: "success",
            summary: $localize`${deletedKeys.length} courses deleted.`
          });
        }

        if (errorKeys && errorKeys.length > 0) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Could not delete ${errorKeys.length} courses.`,
            detail: $localize`Please try again later.`
          });
        }
      }),
      map(() => CourseDraftListActions.load({}))
    );
  });
}
