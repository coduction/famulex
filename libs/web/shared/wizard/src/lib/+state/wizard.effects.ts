import { Injectable, Type }                                     from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType }      from "@ngrx/effects";
import { Store }                                                from "@ngrx/store";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { concatMap, of, tap }                                   from "rxjs";
import { WizardActions }                                        from "./wizard.actions";
import { provideDefaultButtons, Wizard }                        from "./wizard.models";
import { WizardState }                                          from "./wizard.reducer";

@Injectable()
export class WizardEffects {

  // Keep this separate from state to avoid problems with immutability
  dialogRefMap = new Map<string, DynamicDialogRef>();
  componentMap = new Map<string, Type<unknown>>();
  configMap = new Map<string, DynamicDialogConfig>();

  constructor(
    private actions$: Actions,
    private store: Store,
    private dialogService: DialogService
  ) {
  }

  /*************************************************************************
   * Open Wizard
   ************************************************************************/
  openWizard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WizardActions.open),
      concatLatestFrom(({ id }) => this.store.select(WizardState.selectWizardById(id))),
      concatMap(([{ id, component, config }, existingWizard]) => {
        if (existingWizard) {
          return of(WizardActions.openFailure({ id, error: new Error("Wizard with id " + id + " is already opened") }));
        }

        this.componentMap.set(id, component);
        this.configMap.set(id, {
          width: "65rem",
          closable: false,
          draggable: true,
          ...config
        });

        const wizard: Wizard = {
          id,
          activeStepIndex: 0,
          amountOfSteps: 0,
          ...provideDefaultButtons()
        };

        return of(WizardActions.openSuccess({ id, wizard }));
      })
    );
  });

  openWizardSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WizardActions.openSuccess),
      tap(({ id }) => {
        const component = this.componentMap.get(id);
        const config = this.configMap.get(id);

        if (component && config) {
          const dialogRef = this.dialogService.open(component, config);

          this.dialogRefMap.set(id, dialogRef);
        }
      })
    );
  }, { dispatch: false });

  /*************************************************************************
   * Close Wizard
   ************************************************************************/
  closeWizard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WizardActions.cancelSuccess, WizardActions.finishSuccess),
      tap(({ id }) => {
        const dialogRef = this.dialogRefMap.get(id);

        if (dialogRef) {
          dialogRef.close();
        }

        this.dialogRefMap.delete(id);
        this.componentMap.delete(id);
        this.configMap.delete(id);
      })
    );
  }, { dispatch: false });
}
