export interface Wizard {
  id: string;

  activeStepIndex: number;
  amountOfSteps: number;

  cancelButton: WizardButton;
  previousButton: WizardButton;
  nextButton: WizardButton;
  finishButton: WizardButton;
}

export interface WizardButton {
  type: ButtonType;
  status: ButtonStatus;
  label: string;
  icon?: string;
  loading?: boolean;
}

export type WizardAction = "OPEN" | "CANCEL" | "PREVIOUS" | "NEXT" | "FINISH";
export type ButtonStatus = "HIDDEN" | "VISIBLE" | "DISABLED";
export type ButtonType = "FILLED" | "OUTLINED";

export function updateWizard(wizard: Wizard, changes?: Partial<Wizard>, activeAction?: WizardAction): Partial<Wizard> {
  // Extract buttons for easier access. Copy them to avoid mutating the original object
  const wizardClone = structuredClone(wizard);
  const { cancelButton, previousButton, nextButton, finishButton } = wizardClone;

  // Loading state
  cancelButton.loading = activeAction === "CANCEL";
  previousButton.loading = activeAction === "PREVIOUS";
  nextButton.loading = activeAction === "NEXT";
  finishButton.loading = activeAction === "FINISH";

  // If activeStepIndex or amountOfSteps are provided, take them, otherwise use the wizard's values
  const activeStepIndex = changes?.activeStepIndex ?? wizardClone.activeStepIndex;
  const amountOfSteps = changes?.amountOfSteps ?? wizardClone.amountOfSteps;

  // Show or hide buttons
  if (amountOfSteps === 1) {
    previousButton.status = "HIDDEN";
    nextButton.status = "HIDDEN";
    finishButton.status = "VISIBLE";
  } else if (amountOfSteps > 1) {
    if (activeStepIndex === 0) {
      previousButton.status = "HIDDEN";
      nextButton.status = "VISIBLE";
      nextButton.type = "FILLED";
      finishButton.status = "HIDDEN";
    } else if (activeStepIndex > 0 && activeStepIndex < amountOfSteps - 1) {
      previousButton.status = "VISIBLE";
      nextButton.status = "VISIBLE";
      nextButton.type = "FILLED";
      finishButton.status = "HIDDEN";
    } else if (activeStepIndex === amountOfSteps - 1) {
      previousButton.status = "VISIBLE";
      nextButton.status = "DISABLED";
      nextButton.type = "OUTLINED";
      finishButton.status = "VISIBLE";
      finishButton.type = "FILLED";
    }
  }

  return { cancelButton, previousButton, nextButton, finishButton, amountOfSteps, activeStepIndex };
}

export function provideDefaultButtons() {
  const cancelButton: WizardButton = {
    type: "OUTLINED",
    status: "VISIBLE",
    label: $localize`Cancel`,
    icon: "fa fa-fw fa-stop",
    loading: false
  };

  const previousButton: WizardButton = {
    type: "OUTLINED",
    status: "HIDDEN",
    label: $localize`Previous`,
    icon: "fa fa-fw fa-backward-step",
    loading: false
  };

  const nextButton: WizardButton = {
    type: "FILLED",
    status: "HIDDEN",
    label: $localize`Next`,
    icon: "fa fa-fw fa-forward-step",
    loading: false
  };

  const finishButton: WizardButton = {
    type: "OUTLINED",
    status: "HIDDEN",
    label: $localize`Finish`,
    icon: "fa fa-fw fa-circle",
    loading: false
  };

  return { cancelButton, previousButton, nextButton, finishButton };
}
