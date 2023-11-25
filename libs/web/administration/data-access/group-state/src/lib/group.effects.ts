import { HttpErrorResponse }                                                  from "@angular/common/http";
import { Injectable }                                                         from "@angular/core";
import { MessageService }                                                     from "primeng/api";
import { GroupService }                                                       from "@famulex/shared/famulex-api-client";
import { HttpErrorInterceptor }                                               from "@famulex/shared/util";
import { WizardActions }                                                      from "@famulex/web/shared/wizard";
import { Actions, concatLatestFrom, createEffect, ofType }                    from "@ngrx/effects";
import { Store }                                                              from "@ngrx/store";
import { catchError, concatMap, forkJoin, map, mergeMap, of, switchMap, tap } from "rxjs";
import { GroupActions }                                                       from "./group.actions";
import { GROUP_EDIT_WIZARD_ID }                                               from "./group.models";
import { GroupState }                                                         from "./group.reducer";

@Injectable()
export class GroupEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private groupService: GroupService,
    private messageService: MessageService
  ) {
  }

  /*************************************************************************
   * Load
   ************************************************************************/
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActions.load),
      concatLatestFrom(() => this.store.select(GroupState.selectTableMetaData)),
      switchMap(([_, table]) => {
          HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

          return this.groupService.loadGroups(table.pageIndex, table.pageSize, table.sortedBy, table.search).pipe(
            map(page => GroupActions.loadSuccess({ page })),
            catchError((error: HttpErrorResponse) => of(GroupActions.loadFailure({ error })))
          );
        }
      )
    )
  );

  loadFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActions.loadFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while Loading Groups`,
          detail: $localize`Please try again later and reload the page.`
        });
      })
    ), { dispatch: false }
  );

  /*************************************************************************
   * Create User
   ************************************************************************/
  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.create),
      concatMap(({ request }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.groupService.createGroup(request).pipe(
          map(group => GroupActions.createSuccess({ group })),
          catchError((error: HttpErrorResponse) => of(GroupActions.createFailure({ error })))
        );
      })
    );
  });

  createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.createFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error While Creating Group`,
          detail: $localize`Please try again later.`
        });
      }),
      map(() => WizardActions.finishFailure({ id: GROUP_EDIT_WIZARD_ID }))
    );
  });

  createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.createSuccess),
      tap(({ group }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`New Group Created`,
          detail: `${group.name}`
        });
      }),
      concatMap(() => [
        WizardActions.finishSuccess({ id: GROUP_EDIT_WIZARD_ID }),
        GroupActions.load({})
      ])
    );
  });

  /*************************************************************************
   * Update
   ************************************************************************/
  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.update),
      concatMap(({ key, request }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.groupService.updateGroup(key, request).pipe(
          map(group => GroupActions.updateSuccess({ group: { id: key, changes: group } })),
          catchError((error: HttpErrorResponse) => of(GroupActions.updateFailure({ error })))
        );
      })
    );
  });

  updateUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.updateFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error While Updating Group`,
          detail: $localize`Please try again later.`
        });
      }),
      map(() => WizardActions.finishFailure({ id: GROUP_EDIT_WIZARD_ID }))
    );
  });

  updateUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.updateSuccess),
      tap(({ group }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`Group Updated`,
          detail: `${group.changes.name}`
        });
      }),
      concatMap(() => [
        WizardActions.finishSuccess({ id: GROUP_EDIT_WIZARD_ID }),
        GroupActions.load({})
      ])
    );
  });

  /*************************************************************************
   * Delete Single
   ************************************************************************/
  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.delete),
      mergeMap(({ group }) => {
        return this.groupService.deleteGroup(group.key).pipe(
          map(() => GroupActions.deleteSuccess({ group })),
          catchError((error: HttpErrorResponse) => of(GroupActions.deleteFailure({ group, error })))
        );
      })
    );
  });

  deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.deleteSuccess),
      tap(({ group }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`Group Deleted`,
          detail: `${group.name}`
        });
      }),
      map(() => GroupActions.load({}))
    );
  });

  deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.deleteFailure),
      tap(({ group, error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error While Deleting Group`,
          detail: $localize`Could not delete group ${group.name}. Please try again later.`
        });
      })
    );
  }, { dispatch: false });

  /*************************************************************************
   * Delete Multiple
   ************************************************************************/
  deleteMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.deleteMany),
      mergeMap(({ keys }) => {
        const deletedKeys: string[] = [];
        const errorKeys: string[] = [];

        const requests = keys.map(key => {
          return this.groupService.deleteGroup(key).pipe(
            tap(() => deletedKeys.push(key)),
            catchError(error => {
              errorKeys.push(key);
              return of(error);
            })
          );
        });

        return forkJoin(requests).pipe(
          map(() => GroupActions.deleteManyFeedback({ deletedKeys, errorKeys }))
        );
      })
    );
  });

  deleteManyFeedback$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.deleteManyFeedback),
      tap(({ error, deletedKeys, errorKeys }) => {
        if (deletedKeys && deletedKeys.length > 0) {
          this.messageService.add({
            severity: "success",
            summary: $localize`Groups Deleted`,
            detail: `${deletedKeys.length} groups deleted.`
          });
        }

        if (errorKeys && errorKeys.length > 0) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Error While Deleting Groups`,
            detail: $localize`Could not delete ${errorKeys.length} groups. Please try again later.`
          });
        }
      }),
      map(() => GroupActions.load({}))
    );
  });
}
