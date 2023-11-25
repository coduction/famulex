import { HttpErrorResponse }                   from "@angular/common/http";
import { Injectable }                          from "@angular/core";
import { MessageService }                      from "primeng/api";
import { SystemInfoService }                   from "@famulex/shared/famulex-api-client";
import { Actions, createEffect, ofType }       from "@ngrx/effects";
import { Store }                               from "@ngrx/store";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { SystemInfoActions }                   from "./system-info.actions";

@Injectable()
export class SystemInfoEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private systemInfoService: SystemInfoService,
    private messageService: MessageService
  ) {
  }

  /*************************************************************************
   * Load System Info
   ************************************************************************/
  load$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.load),
    switchMap(() => this.systemInfoService.loadSystemInfo().pipe(
      map(systemInfo => SystemInfoActions.loadSuccess({ systemInfo })),
      catchError((error: HttpErrorResponse) => of(SystemInfoActions.loadFailure({ error })))
    ))
  ));

  loadFailure$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.loadFailure),
    tap(() => {
      this.messageService.add({
        severity: "error",
        summary: $localize`Error while Loading System Info`,
        detail: $localize`Please try again later and reload the page.`
      });
    })
  ), { dispatch: false });

  /*************************************************************************
   * Logo
   ************************************************************************/
  uploadLogo$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.uploadLogo),
    switchMap(({ file }) => this.systemInfoService.uploadLogo(file).pipe(
      map(logoPermission => SystemInfoActions.uploadLogoSuccess({ logoPermission })),
      catchError((error: HttpErrorResponse) => of(SystemInfoActions.uploadLogoFailure({ error })))
    ))
  ));

  uploadLogoFailure$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.uploadLogoFailure),
    tap(() => {
      this.messageService.add({
        severity: "error",
        summary: $localize`Error while Uploading Logo`,
        detail: $localize`Please try again later and reload the page.`
      });
    })
  ), { dispatch: false });

  deleteLogo$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.deleteLogo),
    switchMap(() => this.systemInfoService.deleteLogo().pipe(
      map(() => SystemInfoActions.deleteLogoSuccess()),
      catchError((error: HttpErrorResponse) => of(SystemInfoActions.deleteLogoFailure({ error })))
    ))
  ));

  deleteLogoFailure$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.deleteLogoFailure),
    tap(() => {
      this.messageService.add({
        severity: "error",
        summary: $localize`Error while Deleting Logo`,
        detail: $localize`Please try again later and reload the page.`
      });
    })
  ), { dispatch: false });

  /*************************************************************************
   * Compact Logo
   ************************************************************************/
  uploadCompactLogo$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.uploadCompactLogo),
    switchMap(({ file }) => this.systemInfoService.uploadCompactLogo(file).pipe(
      map(compactLogoPermission => SystemInfoActions.uploadCompactLogoSuccess({ compactLogoPermission })),
      catchError((error: HttpErrorResponse) => of(SystemInfoActions.uploadCompactLogoFailure({ error })))
    ))
  ));

  uploadCompactLogoFailure$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.uploadCompactLogoFailure),
    tap(() => {
      this.messageService.add({
        severity: "error",
        summary: $localize`Error while Uploading Compact Logo`,
        detail: $localize`Please try again later and reload the page.`
      });
    })
  ), { dispatch: false });

  deleteCompactLogo$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.deleteCompactLogo),
    switchMap(() => this.systemInfoService.deleteCompactLogo().pipe(
      map(() => SystemInfoActions.deleteCompactLogoSuccess()),
      catchError((error: HttpErrorResponse) => of(SystemInfoActions.deleteCompactLogoFailure({ error })))
    ))
  ));

  deleteCompactLogoFailure$ = createEffect(() => this.actions$.pipe(
    ofType(SystemInfoActions.deleteCompactLogoFailure),
    tap(() => {
      this.messageService.add({
        severity: "error",
        summary: $localize`Error while Deleting Compact Logo`,
        detail: $localize`Please try again later and reload the page.`
      });
    })
  ), { dispatch: false });
}
