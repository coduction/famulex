import { HttpErrorResponse }                                   from "@angular/common/http";
import { Injectable }                                          from "@angular/core";
import { MessageService }                                      from "@coduction/primeng/api";
import { UserService }                                         from "@famulex/shared/famulex-api-client";
import { HttpErrorInterceptor }                                from "@famulex/shared/util";
import { Actions, createEffect, ofType }                       from "@ngrx/effects";
import { Store }                                               from "@ngrx/store";
import { catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { UserActions }                                         from "./user.actions";
import { UserState }                                           from "./user.reducer";

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private userService: UserService,
    private messageService: MessageService
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
        console.log(error);
        this.messageService.add({
          severity: "error",
          summary: $localize`Error while Loading Users`,
          detail: $localize`Please try again later and reload the page.`
        });
      })
    ), { dispatch: false }
  );

  setPagination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setPagination),
      map(() => UserActions.loadUsers())
    )
  );
}
