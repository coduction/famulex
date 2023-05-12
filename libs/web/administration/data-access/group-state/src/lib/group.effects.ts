import { HttpErrorResponse }                                   from "@angular/common/http";
import { Injectable }                                          from "@angular/core";
import { MessageService }                                      from "@coduction/primeng/api";
import { GroupService }                                        from "@famulex/shared/famulex-api-client";
import { HttpErrorInterceptor }                                from "@famulex/shared/util";
import { Actions, createEffect, ofType }                       from "@ngrx/effects";
import { Store }                                               from "@ngrx/store";
import { catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { GroupActions }                                        from "./group.actions";
import { GroupState }                                          from "./group.reducer";

@Injectable()
export class GroupEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private groupService: GroupService,
    private messageService: MessageService
  ) {
  }

  loadGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActions.loadGroups),
      withLatestFrom(this.store.select(GroupState.selectPagination)),
      switchMap(([_, pagination]) => {
          HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = true;

          return this.groupService.loadGroups(pagination.pageNumber, pagination.pageSize, pagination.sortedBy).pipe(
            map(page => GroupActions.loadGroupsSuccess({ page })),
            catchError((error: HttpErrorResponse) => of(GroupActions.loadGroupsFailure({ error })))
          );
        }
      )
    )
  );

  loadGroupsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActions.loadGroupsFailure),
      tap(({ error }) => {
        console.error(error);

        this.messageService.add({
          severity: "error",
          summary: $localize`Error while Loading Groups`,
          detail: $localize`Please try again later and reload the page.`
        });
      })
    ), { dispatch: false }
  );

  setPagination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActions.setPagination),
      map(() => GroupActions.loadGroups())
    )
  );
}
