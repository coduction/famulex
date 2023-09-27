import { HttpErrorResponse }                                                                  from "@angular/common/http";
import { Injectable }                                                                         from "@angular/core";
import { MessageService }                                                                     from "@coduction/primeng/api";
import { SecurityService }                                                                    from "@famulex/shared/famulex-api-client";
import { HttpErrorInterceptor }                                                               from "@famulex/shared/util";
import { WizardActions }                                                                      from "@famulex/web/shared/wizard";
import { Actions, createEffect, ofType }                                                      from "@ngrx/effects";
import { Store }                                                                              from "@ngrx/store";
import { catchError, concatMap, forkJoin, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { RoleActions }                                                                        from "./role.actions";
import { ROLE_CREATE_WIZARD_ID, ROLE_EDIT_WIZARD_ID }                                         from "./role.models";
import { RoleState }                                                                          from "./role.reducer";

@Injectable()
export class RoleEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private securityService: SecurityService,
    private messageService: MessageService
  ) {
  }

  /*************************************************************************
   * Load
   ************************************************************************/
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.load),
      withLatestFrom(this.store.select(RoleState.selectTableMetaData)),
      switchMap(([_, table]) => {
          HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

          return this.securityService.loadRoles(table.pageIndex, table.pageSize, table.sortedBy, table.search).pipe(
            map(page => RoleActions.loadSuccess({ page })),
            catchError((error: HttpErrorResponse) => of(RoleActions.loadFailure({ error })))
          );
        }
      )
    )
  );

  loadFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.loadFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while Loading Roles`,
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
      ofType(RoleActions.create),
      concatMap(({ request }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.securityService.createRole(request).pipe(
          map(role => RoleActions.createSuccess({ role })),
          catchError((error: HttpErrorResponse) => of(RoleActions.createFailure({ error })))
        );
      })
    );
  });

  createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.createFailure),
      tap(({ error }) => {
        if (error.status === 409) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Role already exists`,
            detail: $localize`Provide a different name.`
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: $localize`Error while Creating Role`,
            detail: $localize`Please try again later.`
          });
        }
      }),
      map(() => WizardActions.finishFailure({ id: ROLE_CREATE_WIZARD_ID }))
    );
  });

  createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.createSuccess),
      tap(({ role }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`New Role Created`,
          detail: `${role.name}`
        });
      }),
      concatMap(() => [
        WizardActions.finishSuccess({ id: ROLE_CREATE_WIZARD_ID }),
        RoleActions.load({})
      ])
    );
  });

  /*************************************************************************
   * Update
   ************************************************************************/
  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.update),
      concatMap(({ key, request }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.securityService.updateRole(key, request).pipe(
          map(role => RoleActions.updateSuccess({ update: { id: key, changes: role } })),
          catchError((error: HttpErrorResponse) => of(RoleActions.updateFailure({ error })))
        );
      })
    );
  });

  updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.updateFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while Updating Role`,
          detail: $localize`Please try again later.`
        });
      }),
      concatMap(() => [
        WizardActions.finishFailure({ id: ROLE_EDIT_WIZARD_ID })
      ])
    );
  });

  updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.updateSuccess),
      tap(({ update }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`Role Updated`,
          detail: `${update.changes.name}`
        });
      }),
      concatMap(() => [
        WizardActions.finishSuccess({ id: ROLE_EDIT_WIZARD_ID }),
        RoleActions.load({})
      ])
    );
  });

  /*************************************************************************
   * Delete
   ************************************************************************/
  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.delete),
      mergeMap(({ role }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.securityService.deleteRole(role.key).pipe(
          map(() => RoleActions.deleteSuccess({ role })),
          catchError((error: HttpErrorResponse) => of(RoleActions.deleteFailure({ error })))
        );
      })
    );
  });

  deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.deleteSuccess),
      tap(({ role }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`Role Deleted`,
          detail: `${role.name}`
        });
      }),
      map(() => RoleActions.load({}))
    );
  });

  deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.deleteFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while Deleting Role`,
          detail: $localize`Please try again later.`
        });
      })
    );
  }, { dispatch: false });

  /*************************************************************************
   * Delete Many
   ************************************************************************/
  deleteMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.deleteMany),
      mergeMap(({ keys }) => {
        const deletedKeys: string[] = [];
        const errorKeys: string[] = [];

        const requests = keys.map(key => {
          return this.securityService.deleteRole(key).pipe(
            tap(() => deletedKeys.push(key)),
            catchError(error => {
              errorKeys.push(key);
              return of(error);
            })
          );
        });

        return forkJoin(requests).pipe(
          map(() => RoleActions.deleteManyFeedback({ deletedKeys, errorKeys }))
        );
      })
    );
  });

  deleteUsersFeedback$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleActions.deleteManyFeedback),
      tap(({ error, deletedKeys, errorKeys }) => {
        if (deletedKeys && deletedKeys.length === 1) {
          this.messageService.add({
            severity: "success",
            summary: $localize`Role Deleted`,
            detail: `${deletedKeys.length} role deleted.`
          });
        }

        if (deletedKeys && deletedKeys.length > 1) {
          this.messageService.add({
            severity: "success",
            summary: $localize`Roles Deleted`,
            detail: `${deletedKeys.length} roles deleted.`
          });
        }

        if (errorKeys && errorKeys.length === 1) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Error while Deleting Roles`,
            detail: $localize`Could not delete ${errorKeys.length} role. Please try again later.`
          });
        }

        if (errorKeys && errorKeys.length > 1) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Error while Deleting Roles`,
            detail: $localize`Could not delete ${errorKeys.length} roles. Please try again later.`
          });
        }
      }),
      map(() => RoleActions.load({}))
    );
  });
}
