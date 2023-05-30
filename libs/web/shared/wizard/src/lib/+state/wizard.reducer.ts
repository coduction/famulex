import { createEntityAdapter, EntityAdapter, EntityState, Update } from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on }        from "@ngrx/store";
import { WizardActions }                                           from "./wizard.actions";

import { updateWizard, Wizard } from "./wizard.models";

export const WIZARD_FEATURE_KEY = "wizards";

export const wizardAdapter: EntityAdapter<Wizard> = createEntityAdapter<Wizard>();

export const initialWizardState: EntityState<Wizard> = wizardAdapter.getInitialState({});

const wizardReducer = createReducer(
  initialWizardState,

  /*************************************************************************
   * Open Wizard
   ************************************************************************/
  on(WizardActions.openSuccess, (state, { wizard }) => {
    return wizardAdapter.addOne(wizard, state);
  }),
  on(WizardActions.update, (state, { id, changes }) => {
    const wizard = state.entities[id];

    if (!wizard) {
      return state;
    }

    const update: Update<Wizard> = {
      id,
      changes: updateWizard(wizard, changes)
    };

    return wizardAdapter.updateOne(update, state);
  }),

  /*************************************************************************
   * Cancel Button
   ************************************************************************/
  on(WizardActions.cancel, (state, { id }) => {
    const wizard = state.entities[id];

    if (!wizard) {
      return state;
    }

    const update: Update<Wizard> = {
      id,
      changes: updateWizard(wizard, undefined, "CANCEL")
    };

    return wizardAdapter.updateOne(update, state);
  }),

  /*************************************************************************
   * Previous Button
   ************************************************************************/
  on(WizardActions.previous, (state, { id }) => {
    const wizard = state.entities[id];

    if (!wizard) {
      return state;
    }

    const update: Update<Wizard> = {
      id,
      changes: updateWizard(wizard, undefined, "PREVIOUS")
    };

    return wizardAdapter.updateOne(update, state);
  }),
  on(WizardActions.previousSuccess, (state, { id }) => {
    const wizard = state.entities[id];

    if (!wizard) {
      return state;
    }

    const activeStepIndex = wizard.activeStepIndex - 1;
    const update: Update<Wizard> = {
      id,
      changes: updateWizard(wizard, { activeStepIndex })
    };

    return wizardAdapter.updateOne(update, state);
  }),

  /*************************************************************************
   * Next Button
   ************************************************************************/
  on(WizardActions.next, (state, { id }) => {
    const wizard = state.entities[id];

    if (!wizard) {
      return state;
    }

    const update: Update<Wizard> = {
      id,
      changes: updateWizard(wizard, undefined, "NEXT")
    };

    return wizardAdapter.updateOne(update, state);
  }),
  on(WizardActions.nextSuccess, (state, { id }) => {
    const wizard = state.entities[id];

    if (!wizard) {
      return state;
    }

    const activeStepIndex = wizard.activeStepIndex + 1;
    const update: Update<Wizard> = {
      id,
      changes: updateWizard(wizard, { activeStepIndex })
    };

    return wizardAdapter.updateOne(update, state);
  }),

  /*************************************************************************
   * Finish Button
   ************************************************************************/
  on(WizardActions.finish, (state, { id }) => {
    const wizard = state.entities[id];

    if (!wizard) {
      return state;
    }

    const update: Update<Wizard> = {
      id,
      changes: updateWizard(wizard, undefined, "FINISH")
    };

    return wizardAdapter.updateOne(update, state);
  }),

  /*************************************************************************
   * Finish Button
   ************************************************************************/
  on(WizardActions.cancelSuccess, WizardActions.finishSuccess, (state, { id }) => {
    return wizardAdapter.removeOne(id, state);
  }),

  /*************************************************************************
   * Action Failure
   ************************************************************************/
  on(WizardActions.cancelFailure, WizardActions.previousFailure, WizardActions.nextFailure, WizardActions.finishFailure, (state, { id }) => {
    const wizard = state.entities[id];

    if (!wizard) {
      return state;
    }

    const update: Update<Wizard> = {
      id,
      changes: updateWizard(wizard)
    };

    return wizardAdapter.updateOne(update, state);
  })
);

export const WizardState = createFeature({
  name: WIZARD_FEATURE_KEY,
  reducer: wizardReducer,
  extraSelectors: ({ selectWizardsState }) => ({
    ...wizardAdapter.getSelectors(selectWizardsState),
    selectWizardById: (id: string) => createSelector(
      selectWizardsState,
      (state) => state.entities[id]
    )
  })
});
