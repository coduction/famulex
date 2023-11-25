import { Injectable, NgZone }                              from "@angular/core";
import { Router }                                          from "@angular/router";
import { MessageService }                                  from "primeng/api";
import { DialogService }                                   from "primeng/dynamicdialog";
import { CourseDraftService, CourseMembershipService }     from "@famulex/shared/famulex-api-client";
import { HttpErrorInterceptor }                            from "@famulex/shared/util";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store }                                           from "@ngrx/store";
import { catchError, map, mergeMap, of, switchMap, tap }   from "rxjs";
import { CourseDraftNodesActions }                         from "./course-draft-nodes.actions";
import { CourseDraftNodesState }                           from "./course-draft-nodes.reducer";
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
    private messageService: MessageService,
    private dialogService: DialogService,
    private ngZone: NgZone
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
      concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
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

  publishSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftActions.publishSuccess),
      map(() => CourseDraftNodesActions.load())
    );
  });

  /*************************************************************************
   * General Actions
   ************************************************************************/
  selectCourseDraftNode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.selectNode),
      map(CourseDraftNodesActions.clearActions)
    );
  });

  deselectCourseDraftNode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.deselectNode),
      concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
      tap(([_, courseDraftKey]) => void this.ngZone.run(() => this.router.navigate(["/", "authoring", "courses", courseDraftKey]))),
      map(CourseDraftNodesActions.clearActions)
    );
  });

  /*************************************************************************
   * Create
   ************************************************************************/
  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.create),
      concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
      mergeMap(([{ request, dialog }, courseDraftKey]) => {
        if (!courseDraftKey) {
          return of(CourseDraftNodesActions.createFailure({}));
        }

        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.courseDraftService.createCourseDraftNode(courseDraftKey, request).pipe(
          map(response => CourseDraftNodesActions.createSuccess({ response, dialog })),
          catchError(httpError => of(CourseDraftNodesActions.createFailure({ httpError })))
        );
      })
    );
  });

  createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.createFailure),
      tap(({ httpError }) => {
        if (httpError) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Could Not Create New Node`,
            detail: $localize`Please try again later.`
          });
        }
      })
    );
  }, { dispatch: false });

  createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.createSuccess),
      concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
      tap(([{ response, dialog }, courseDraftKey]) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`New Node Added`,
          detail: `${response.title}`
        });

        if (dialog) {
          dialog.close();
        }

        if (courseDraftKey) {
          void this.ngZone.run(() => this.router.navigate(["/", "authoring", "courses", courseDraftKey, "content", response.key]));
        }
      })
    );
  }, { dispatch: false });

  /*************************************************************************
   * Update
   ************************************************************************/
  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.update),
      concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
      mergeMap(([{ key, request, dialog }, courseDraftKey]) => {
        if (!courseDraftKey || !key) {
          return of(CourseDraftNodesActions.updateFailure({}));
        }

        return this.courseDraftService.updateCourseDraftNode(courseDraftKey, key, request).pipe(
          map(response => CourseDraftNodesActions.updateSuccess({ update: { id: key, changes: response }, dialog })),
          catchError(httpError => of(CourseDraftNodesActions.updateFailure({ httpError })))
        );
      })
    );
  });

  updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.updateSuccess),
      tap(({ update, dialog }) => {
        this.messageService.add({ severity: "success", summary: $localize`Changes Saved` });

        if (dialog) {
          dialog.close();
        }
      })
    );
  }, { dispatch: false });

  updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.updateFailure),
      tap(({ httpError }) => {
        if (httpError) {
          this.messageService.add({ severity: "error", summary: $localize`Error while Saving Changes`, detail: $localize`Something went wrong, please try again later.` });
        }
      })
    );
  }, { dispatch: false });

  /*************************************************************************
   * Delete
   ************************************************************************/
  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.delete),
      concatLatestFrom(() => this.store.select(CourseDraftState.selectKey)),
      mergeMap(([{ node }, courseDraftKey]) => {
        if (!courseDraftKey) {
          return of(CourseDraftNodesActions.deleteFailure({ node }));
        }

        return this.courseDraftService.deleteCourseDraftNode(courseDraftKey, node.key).pipe(
          map(() => CourseDraftNodesActions.deleteSuccess({ node })),
          catchError(httpError => of(CourseDraftNodesActions.deleteFailure({ node, httpError })))
        );
      })
    );
  });

  deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.deleteSuccess),
      concatLatestFrom(() => this.store.select(CourseDraftNodesState.selectCurrentKey)),
      tap(([{ node }, currentNodeKey]) => {
        this.messageService.add({ severity: "success", summary: $localize`Node Deleted`, detail: node.title });

        if (node.key === currentNodeKey) {
          this.store.dispatch(CourseDraftNodesActions.deselectNode());
        }
      })
    );
  }, { dispatch: false });

  deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.deleteFailure),
      tap(({ httpError, node }) => {
        if (httpError) {
          this.messageService.add({ severity: "error", summary: $localize`Error while Deleting Node`, detail: node.title });
        }
      })
    );
  }, { dispatch: false });
}
