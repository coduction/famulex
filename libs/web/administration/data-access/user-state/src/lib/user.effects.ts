import { HttpErrorResponse }                                                        from "@angular/common/http";
import { Injectable }                                                               from "@angular/core";
import { MessageService }                                                           from "@coduction/primeng/api";
import { UserService }                                                              from "@famulex/shared/famulex-api-client";
import { AuthService }                                                              from "@famulex/shared/security/util";
import { HttpErrorInterceptor }                                                     from "@famulex/shared/util";
import { Actions, createEffect, ofType }                                            from "@ngrx/effects";
import { Store }                                                                    from "@ngrx/store";
import { catchError, concatMap, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { UserActions }                                                              from "./user.actions";
import { UserState }                                                                from "./user.reducer";

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

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      withLatestFrom(this.store.select(UserState.selectPagination)),
      switchMap(([_, pagination]) => {
          HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

          return this.userService.loadUsers(pagination.pageNumber, pagination.pageSize, pagination.sortedBy).pipe(
            map(page => UserActions.loadUsersSuccess({ page })),
            catchError((error: HttpErrorResponse) => of(UserActions.loadUsersFailure({ error })))
          );
        }
      )
    )
  );

  loadUsersFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsersFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while Loading Users`,
          detail: $localize`Please try again later and reload the page.`
        });
      })
    ), { dispatch: false }
  );

  createUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.createUser),
      concatMap(({ userRequest }) => {
        HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

        return this.userService.createUser(userRequest).pipe(
          map(user => UserActions.createUserSuccess({ user })),
          catchError((error: HttpErrorResponse) => of(UserActions.createUserFailure({ error })))
        );
      })
    );
  });

  createUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.createUserFailure),
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
      ofType(UserActions.createUserSuccess),
      tap(({ user }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`New user created successfully`,
          detail: `${user.firstName} ${user.lastName}`
        });
      })
    );
  }, { dispatch: false });

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ user }) => {
        if (user.key === this.authService.userKey) {
          return of(UserActions.deleteUserFailure({ isCurrentUser: true }));
        }

        return this.userService.deleteUser(user.key).pipe(
          map(() => UserActions.deleteUserSuccess({ user })),
          catchError((error: HttpErrorResponse) => of(UserActions.deleteUserFailure({ error })))
        );
      })
    );
  });

  deleteUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteUserSuccess),
      tap(({ user }) => {
        this.messageService.add({
          severity: "success",
          summary: $localize`User deleted successfully`,
          detail: `${user.firstName} ${user.lastName}`
        });
      })
    );
  }, { dispatch: false });

  deleteUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteUserFailure),
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

  setPagination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setPagination),
      map(() => UserActions.loadUsers())
    )
  );
}
