import { HttpErrorResponse }                               from "@angular/common/http";
import { Injectable }                                      from "@angular/core";
import { MessageService }                                  from "primeng/api";
import { TestDraftService }                                from "@famulex/shared/famulex-api-client";
import { HttpErrorInterceptor }                            from "@famulex/shared/util";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store }                                           from "@ngrx/store";
import { catchError, map, of, switchMap, tap }             from "rxjs";
import { TestDraftActions }                                from "./test-draft.actions";
import { TestDraftsState }                                 from "./test-draft.reducer";

@Injectable()
export class TestDraftEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private testDraftService: TestDraftService,
    private messageService: MessageService
  ) {
  }

  /*************************************************************************
   * Load
   ************************************************************************/
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TestDraftActions.load),
      concatLatestFrom(() => this.store.select(TestDraftsState.selectTableMetaData)),
      switchMap(([_, table]) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.testDraftService.loadTestDrafts(table.pageIndex, table.pageSize, table.sortedBy).pipe(
          map(response => TestDraftActions.loadSuccess({ response })),
          catchError((httpError: HttpErrorResponse) => of(TestDraftActions.loadFailure({ httpError })))
        );
      })
    );
  });

  /*************************************************************************
   * Select
   ************************************************************************/
  select$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TestDraftActions.select),
      switchMap(({ key }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.testDraftService.loadTestDraft(key).pipe(
          map(response => TestDraftActions.selectSuccess({ response })),
          catchError((httpError: HttpErrorResponse) => of(TestDraftActions.selectFailure({ httpError })))
        );
      })
    );
  });

  /*************************************************************************
   * Publish
   ************************************************************************/
  // publish$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(TestDraftActions.publish),
  //     concatLatestFrom(() => this.store.select(CourseDraftState.selectCurrentKey)),
  //     switchMap(([_, testDraftKey]) => {
  //       if (!testDraftKey) {
  //         return of(TestDraftActions.publishFailure({}));
  //       }
  //
  //       HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;
  //
  //       return this.testDraftService.publishTestDraft(testDraftKey).pipe(
  //         map(response => TestDraftActions.publishSuccess({ response })),
  //         catchError(httpError => of(TestDraftActions.publishFailure({ httpError, response: httpError.error })))
  //       );
  //     })
  //   );
  // });

  publishFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TestDraftActions.publishFailure),
      tap(({ httpError }) => {
        if (httpError) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Could Not Publish Test`,
            detail: $localize`Please fix all errors and publish again.`
          });
        }
      })
    );
  }, { dispatch: false });

  publishSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TestDraftActions.publishSuccess),
      tap(({ response }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`Test Published`,
          detail: `${response.title}`
        });
      })
    );
  }, { dispatch: false });

}
