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
  visible: boolean;
  disabled: boolean;
  label: string;
  icon?: string;
  loading?: boolean;
}

export type WizardAction = "OPEN" | "CANCEL" | "PREVIOUS" | "NEXT" | "FINISH";
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

  // If an action is active, disable all buttons
  if (activeAction) {
    cancelButton.disabled = true;
    previousButton.disabled = true;
    nextButton.disabled = true;
    finishButton.disabled = true;
  } else {
    // If no action is active, enable all buttons
    cancelButton.disabled = false;
    previousButton.disabled = false;
    nextButton.disabled = false;
    finishButton.disabled = false;
  }

  // If activeStepIndex or amountOfSteps are provided, take them, otherwise use the wizard's values
  const activeStepIndex = changes?.activeStepIndex ?? wizardClone.activeStepIndex;
  const amountOfSteps = changes?.amountOfSteps ?? wizardClone.amountOfSteps;

  // Show or hide buttons
  if (amountOfSteps === 1) {
    previousButton.visible = false;
    nextButton.visible = false;
    finishButton.visible = true;
  } else if (amountOfSteps > 1) {
    if (activeStepIndex === 0) {
      previousButton.visible = false;
      nextButton.visible = true;
      nextButton.type = "FILLED";
      finishButton.visible = false;
    } else if (activeStepIndex > 0 && activeStepIndex < amountOfSteps - 1) {
      previousButton.visible = true;
      nextButton.visible = true;
      nextButton.type = "FILLED";
      finishButton.visible = false;
    } else if (activeStepIndex === amountOfSteps - 1) {
      previousButton.visible = true;
      nextButton.visible = true;
      nextButton.disabled = true;
      nextButton.type = "OUTLINED";
      finishButton.visible = true;
      finishButton.type = "FILLED";
    }
  }


  return { cancelButton, previousButton, nextButton, finishButton, amountOfSteps, activeStepIndex };
}

export function provideDefaultButtons() {
  const cancelButton: WizardButton = {
    type: "OUTLINED",
    visible: true,
    disabled: false,
    label: $localize`Cancel`,
    icon: "fa fa-fw fa-stop",
    loading: false
  };

  const previousButton: WizardButton = {
    type: "OUTLINED",
    visible: false,
    disabled: false,
    label: $localize`Previous`,
    icon: "fa fa-fw fa-backward-step",
    loading: false
  };

  const nextButton: WizardButton = {
    type: "FILLED",
    visible: false,
    disabled: false,
    label: $localize`Next`,
    icon: "fa fa-fw fa-forward-step",
    loading: false
  };

  const finishButton: WizardButton = {
    type: "OUTLINED",
    visible: false,
    disabled: false,
    label: $localize`Finish`,
    icon: "fa fa-fw fa-circle",
    loading: false
  };

  return { cancelButton, previousButton, nextButton, finishButton };
}
