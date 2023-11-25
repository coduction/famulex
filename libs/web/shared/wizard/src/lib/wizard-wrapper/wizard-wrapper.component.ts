import { CommonModule }                                                               from "@angular/common";
import { AfterContentInit, Component, ContentChildren, DestroyRef, Input, QueryList } from "@angular/core";
import { takeUntilDestroyed }                                                         from "@angular/core/rxjs-interop";
import { MenuItem }                                                                   from "primeng/api";
import { ofType }                                                                     from "@ngrx/effects";
import { ActionsSubject, Store }                                                      from "@ngrx/store";
import { filter, tap }                                                                from "rxjs";
import { WizardActions }                                                              from "../+state/wizard.actions";
import { Wizard }                                                                     from "../+state/wizard.models";
import { WizardState }                                                                from "../+state/wizard.reducer";
import { WizardButtonsComponent }                                                     from "../wizard-buttons/wizard-buttons.component";
import { WizardStepComponent }                                                        from "../wizard-step/wizard-step.component";
import { WizardStepsComponent }                                                       from "../wizard-steps/wizard-steps.component";

@Component({
  selector: "wizard-wrapper",
  standalone: true,
  imports: [CommonModule, WizardStepsComponent, WizardButtonsComponent],
  templateUrl: "./wizard-wrapper.component.html",
  styleUrls: ["./wizard-wrapper.component.scss"]
})
export class WizardWrapperComponent implements AfterContentInit {

  @Input({ required: true }) id!: string;
  @Input() onCancel?: () => Promise<boolean | void | null | undefined> | boolean | void | null | undefined;
  @Input() onFinish?: () => Promise<boolean | void | null | undefined> | boolean | void | null | undefined;

  @ContentChildren(WizardStepComponent) stepComponents!: QueryList<WizardStepComponent>;

  protected wizard!: Wizard;
  protected steps: MenuItem[] = [];
  protected activeStepComponent?: WizardStepComponent;

  constructor(private store: Store,
              private actions$: ActionsSubject,
              private destroyRef: DestroyRef) {
    // Listen to actions from the store
    actions$.pipe(
      takeUntilDestroyed(),
      ofType(WizardActions.cancel, WizardActions.previous, WizardActions.next, WizardActions.finish),
      filter(action => action.id === this.id),
      tap(({ type }) => {
        if (type === WizardActions.cancel.type) {
          void this.executeOnCancel();
        } else if (type === WizardActions.previous.type) {
          void this.executeOnPrevious(this.wizard.activeStepIndex);
        } else if (type === WizardActions.next.type) {
          void this.executeOnNext(this.wizard.activeStepIndex);
        } else if (type === WizardActions.finish.type) {
          void this.executeOnFinish();
        }
      })
    ).subscribe();
  }

  ngAfterContentInit() {
    this.steps = this.stepComponents.map((step, index) => ({
      label: step.title,
      command: () => this.onActivateStep(index)
    }));

    // Update the amount of steps
    this.store.dispatch(WizardActions.update({ id: this.id, changes: { amountOfSteps: this.stepComponents.length } }));

    // Select the wizard from the state
    // The store controls the state of the wizard
    this.store.select(WizardState.selectWizardById(this.id))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(wizard => {
        if (!wizard) {
          if (!this.wizard) {
            console.error(`Wizard with id ${this.id} not found!`);
          }

          return;
        }

        this.wizard = wizard;

        // Activate the step in a timeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => this.onActivateStep(wizard.activeStepIndex));
      });
  }

  onActivateStep(index: number) {
    this.activeStepComponent = this.stepComponents.get(index);
  }

  async executeOnCancel() {
    if (this.onCancel) {
      const result = await this.onCancel();

      if (typeof result === "boolean") {
        if (result) {
          this.store.dispatch(WizardActions.cancelSuccess({ id: this.id }));
        } else {
          this.store.dispatch(WizardActions.cancelFailure({ id: this.id }));
        }
      }

      return;
    }

    this.store.dispatch(WizardActions.cancelSuccess({ id: this.id }));
  }

  async executeOnPrevious(index: number) {
    const stepComponent = this.stepComponents.get(index);

    if (!stepComponent) {
      console.error(`Step component with index ${index} for wizard ${this.id} not found!`);
      return;
    }

    if (stepComponent.onPrevious) {
      const onPrevious = await stepComponent.onPrevious();

      if (typeof onPrevious === "boolean") {
        if (onPrevious) {
          this.store.dispatch(WizardActions.previousSuccess({ id: this.id, index }));
        } else {
          this.store.dispatch(WizardActions.previousFailure({ id: this.id, index }));
        }
      }

      return;
    }

    this.store.dispatch(WizardActions.previousSuccess({ id: this.id, index }));
  }

  async executeOnNext(index: number) {
    const stepComponent = this.stepComponents.get(index);

    if (!stepComponent) {
      console.error(`Step component with index ${index} for wizard ${this.id} not found!`);
      return;
    }

    if (stepComponent.onNext) {
      const onNext = await stepComponent.onNext();

      if (typeof onNext === "boolean") {
        if (onNext) {
          this.store.dispatch(WizardActions.nextSuccess({ id: this.id, index }));
        } else {
          this.store.dispatch(WizardActions.nextFailure({ id: this.id, index }));
        }
      }

      return;
    }

    this.store.dispatch(WizardActions.nextSuccess({ id: this.id, index }));
  }

  async executeOnFinish() {
    if (this.onFinish) {
      const result = await this.onFinish();

      if (typeof result === "boolean") {
        if (result) {
          this.store.dispatch(WizardActions.finishSuccess({ id: this.id }));
        } else {
          this.store.dispatch(WizardActions.finishFailure({ id: this.id }));
        }
      }

      return;
    }

    this.store.dispatch(WizardActions.finishSuccess({ id: this.id }));
  }
}
