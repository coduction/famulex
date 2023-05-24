import { HttpErrorResponse }                                                                  from "@angular/common/http";
import { Injectable }                                                                         from "@angular/core";
import { MessageService }                                                                     from "@coduction/primeng/api";
import { UserService }                                                                        from "@famulex/shared/famulex-api-client";
import { AuthService }                                                                        from "@famulex/shared/security/util";
import { HttpErrorInterceptor }                                                               from "@famulex/shared/util";
import { Actions, createEffect, ofType }                                                      from "@ngrx/effects";
import { Store }                                                                              from "@ngrx/store";
import { catchError, concatMap, forkJoin, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { UserActions }                                                                        from "./user.actions";
import { UserState }                                                                          from "./user.reducer";

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService // TODO Alex: Refactor this and put auth data into a separate state
  ) {
  }

  /*************************************************************************
   * Load Users
   ************************************************************************/
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.load),
      withLatestFrom(this.store.select(UserState.selectTableMetaData)),
      switchMap(([_, table]) => {
          HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

          return this.userService.loadUsers(table.pageIndex, table.pageSize, table.sortedBy, table.globalFilter).pipe(
            map(page => UserActions.loadSuccess({ page })),
            catchError((error: HttpErrorResponse) => of(UserActions.loadFailure({ error })))
          );
        }
      )
    )
  );

  loadUsersFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while Loading Users`,
          detail: $localize`Please try again later and reload the page.`
        });
      })
    ), { dispatch: false }
  );

  /*************************************************************************
   * Create User
   ************************************************************************/
  createUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.create),
      concatMap(({ userRequest }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.userService.createUser(userRequest).pipe(
          map(user => UserActions.createSuccess({ user })),
          catchError((error: HttpErrorResponse) => of(UserActions.createFailure({ error })))
        );
      })
    );
  });

  createUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.createFailure),
      tap(({ error }) => {
        if (error.status === 409) {
          this.messageService.add({
            severity: "error",
            summary: $localize`User already exists`,
            detail: $localize`Provide a different username or email.`
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: $localize`Error while creating user`,
            detail: $localize`Please try again later.`
          });
        }
      })
    );
  }, { dispatch: false });

  createUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.createSuccess),
      tap(({ user }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`New user created successfully`,
          detail: `${user.firstName} ${user.lastName}`
        });
      }),
      map(() => UserActions.load({}))
    );
  });

  /*************************************************************************
   * Update User
   ************************************************************************/
  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.update),
      concatMap(({ key, userRequest }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.userService.updateUser(key, userRequest).pipe(
          map(user => UserActions.updateSuccess({ user: { id: key, changes: user } })),
          catchError((error: HttpErrorResponse) => of(UserActions.updateFailure({ error })))
        );
      })
    );
  });

  updateUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while updating user`,
          detail: $localize`Please try again later.`
        });
      })
    );
  }, { dispatch: false });

  updateUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateSuccess),
      tap(({ user }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`User updated successfully`,
          detail: `${user.changes.firstName} ${user.changes.lastName}`
        });
      }),
      map(() => UserActions.load({}))
    );
  });

  /*************************************************************************
   * Delete Single Users
   ************************************************************************/
  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.delete),
      mergeMap(({ user }) => {
        if (user.key === this.authService.userKey) {
          return of(UserActions.deleteFailure({ isCurrentUser: true }));
        }

        return this.userService.deleteUser(user.key).pipe(
          map(() => UserActions.deleteSuccess({ user })),
          catchError((error: HttpErrorResponse) => of(UserActions.deleteFailure({ error })))
        );
      })
    );
  });

  deleteUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteSuccess),
      tap(({ user }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`User deleted successfully`,
          detail: `${user.firstName} ${user.lastName}`
        });
      }),
      map(() => UserActions.load({}))
    );
  });

  deleteUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteFailure),
      tap(({ error, isCurrentUser }) => {
        if (isCurrentUser) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Error while deleting user`,
            detail: $localize`You cannot delete yourself.`
          });
        }
      })
    );
  }, { dispatch: false });

  /*************************************************************************
   * Delete Multiple Users
   ************************************************************************/
  deleteUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteMany),
      mergeMap(({ keys }) => {
        if (keys.includes(this.authService.userKey)) {
          return of(UserActions.deleteManyFeedback({ containsCurrentUser: true }));
        }

        const deletedKeys: string[] = [];
        const errorKeys: string[] = [];

        const requests = keys.map(key => {
          return this.userService.deleteUser(key).pipe(
            tap(() => deletedKeys.push(key)),
            catchError(error => {
              errorKeys.push(key);
              return of(error);
            })
          );
        });

        return forkJoin(requests).pipe(
          map(() => UserActions.deleteManyFeedback({ deletedKeys, errorKeys }))
        );
      })
    );
  });

  deleteUsersFeedback$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteManyFeedback),
      tap(({ error, containsCurrentUser, deletedKeys, errorKeys }) => {
        if (containsCurrentUser) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Error while deleting users`,
            detail: $localize`You cannot delete yourself. Remove yourself from the selection and try again.`
          });
        }

        if (deletedKeys && deletedKeys.length > 0) {
          this.messageService.add({
            severity: "success",
            summary: $localize`Users deleted successfully`,
            detail: `${deletedKeys.length} users deleted.`
          });
        }

        if (errorKeys && errorKeys.length > 0) {
          this.messageService.add({
            severity: "error",
            summary: $localize`Error while deleting users`,
            detail: $localize`Could not delete ${errorKeys.length} users. Please try again later.`
          });
        }
      }),
      map(() => UserActions.load({}))
    );
  });
}
