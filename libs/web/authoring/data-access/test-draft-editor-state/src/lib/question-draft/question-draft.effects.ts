import { Injectable, NgZone }                              from "@angular/core";
import { Router }                                          from "@angular/router";
import { MessageService }                                  from "@coduction/primeng/api";
import { DialogService }                                   from "@coduction/primeng/dynamicdialog";
import { TestDraftService }                                from "@famulex/shared/famulex-api-client";
import { TestDraftActions, TestDraftsState }               from "@famulex/web/authoring/data-access/test-draft-editor-state";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store }                                           from "@ngrx/store";
import { catchError, map, of, switchMap }                  from "rxjs";
import { QuestionDraftActions }                            from "./question-draft.actions";

@Injectable()
export class QuestionDraftEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private testDraftService: TestDraftService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private ngZone: NgZone
  ) {
  }

  /*************************************************************************
   * Load
   ************************************************************************/
  loadTestDraft$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TestDraftActions.load),
      map(() => QuestionDraftActions.load())
    );
  });

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionDraftActions.load),
      concatLatestFrom(() => this.store.select(TestDraftsState.selectCurrentKey)),
      switchMap(([_, courseDraftKey]) => {
        if (!courseDraftKey) {
          return of(QuestionDraftActions.loadFailure({}));
        }

        return this.testDraftService.loadQuestions(courseDraftKey).pipe(
          map(response => QuestionDraftActions.loadSuccess({ response })),
          catchError(httpError => of(QuestionDraftActions.loadFailure({ httpError })))
        );
      })
    );
  });

  /*************************************************************************
   * General Actions
   ************************************************************************/
  // selectCourseDraftNode$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.selectNode),
  //     map(QuestionDraftActions.clearActions)
  //   );
  // });
  //
  // deselectCourseDraftNode$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.deselectNode),
  //     concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
  //     tap(([_, courseDraftKey]) => void this.ngZone.run(() => this.router.navigate(["/", "authoring", "courses", courseDraftKey]))),
  //     map(QuestionDraftActions.clearActions)
  //   );
  // });

  /*************************************************************************
   * Create
   ************************************************************************/
  // create$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.create),
  //     concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
  //     mergeMap(([{ request, dialog }, courseDraftKey]) => {
  //       if (!courseDraftKey) {
  //         return of(QuestionDraftActions.createFailure({}));
  //       }
  //
  //       HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;
  //
  //       return this.courseDraftService.createCourseDraftNode(courseDraftKey, request).pipe(
  //         map(response => QuestionDraftActions.createSuccess({ response, dialog })),
  //         catchError(httpError => of(QuestionDraftActions.createFailure({ httpError })))
  //       );
  //     })
  //   );
  // });
  //
  // createFailure$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.createFailure),
  //     tap(({ httpError }) => {
  //       if (httpError) {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: $localize`Could Not Create New Node`,
  //           detail: $localize`Please try again later.`
  //         });
  //       }
  //     })
  //   );
  // }, { dispatch: false });
  //
  // createSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.createSuccess),
  //     concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
  //     tap(([{ response, dialog }, courseDraftKey]) => {
  //       this.messageService.add({
  //         severity: "success",
  //         summary: $localize`New Node Added`,
  //         detail: `${response.title}`
  //       });
  //
  //       if (dialog) {
  //         dialog.close();
  //       }
  //
  //       if (courseDraftKey) {
  //         void this.ngZone.run(() => this.router.navigate(["/", "authoring", "courses", courseDraftKey, "content", response.key]));
  //       }
  //     })
  //   );
  // }, { dispatch: false });
  //
  // /*************************************************************************
  //  * Update
  //  ************************************************************************/
  // update$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.update),
  //     concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
  //     mergeMap(([{ key, request, dialog }, courseDraftKey]) => {
  //       if (!courseDraftKey || !key) {
  //         return of(QuestionDraftActions.updateFailure({}));
  //       }
  //
  //       return this.courseDraftService.updateCourseDraftNode(courseDraftKey, key, request).pipe(
  //         map(response => QuestionDraftActions.updateSuccess({ update: { id: key, changes: response }, dialog })),
  //         catchError(httpError => of(QuestionDraftActions.updateFailure({ httpError })))
  //       );
  //     })
  //   );
  // });
  //
  // updateSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.updateSuccess),
  //     tap(({ update, dialog }) => {
  //       this.messageService.add({ severity: "success", summary: $localize`Changes Saved` });
  //
  //       if (dialog) {
  //         dialog.close();
  //       }
  //     })
  //   );
  // }, { dispatch: false });
  //
  // updateFailure$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.updateFailure),
  //     tap(({ httpError }) => {
  //       if (httpError) {
  //         this.messageService.add({ severity: "error", summary: $localize`Error while Saving Changes`, detail: $localize`Something went wrong, please try again later.` });
  //       }
  //     })
  //   );
  // }, { dispatch: false });
  //
  // /*************************************************************************
  //  * Delete
  //  ************************************************************************/
  // delete$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.delete),
  //     concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
  //     mergeMap(([{ node }, courseDraftKey]) => {
  //       if (!courseDraftKey) {
  //         return of(QuestionDraftActions.deleteFailure({ node }));
  //       }
  //
  //       return this.courseDraftService.deleteCourseDraftNode(courseDraftKey, node.key).pipe(
  //         map(() => QuestionDraftActions.deleteSuccess({ node })),
  //         catchError(httpError => of(QuestionDraftActions.deleteFailure({ node, httpError })))
  //       );
  //     })
  //   );
  // });
  //
  // deleteSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.deleteSuccess),
  //     concatLatestFrom(() => this.store.select(CourseDraftNodesState.selectCurrentKey)),
  //     tap(([{ node }, currentNodeKey]) => {
  //       this.messageService.add({ severity: "success", summary: $localize`Node Deleted`, detail: node.title });
  //
  //       if (node.key === currentNodeKey) {
  //         this.store.dispatch(QuestionDraftActions.deselectNode());
  //       }
  //     })
  //   );
  // }, { dispatch: false });
  //
  // deleteFailure$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(QuestionDraftActions.deleteFailure),
  //     tap(({ httpError, node }) => {
  //       if (httpError) {
  //         this.messageService.add({ severity: "error", summary: $localize`Error while Deleting Node`, detail: node.title });
  //       }
  //     })
  //   );
  // }, { dispatch: false });
}
