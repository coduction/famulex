import { Type }                     from "@angular/core";
import { createActionGroup, props } from "@ngrx/store";
import { DynamicDialogConfig }      from "primeng/dynamicdialog";
import { Wizard }                   from "./wizard.models";

export const WizardActions = createActionGroup({
  source: "Wizard",
  events: {
    "Open": props<{ component: Type<unknown>, id: string, config?: DynamicDialogConfig }>(),
    "Open Success": props<{ id: string, wizard: Wizard }>(),
    "Open Failure": props<{ id: string, error: Error }>(),

    "Update": props<{ id: string, changes: Partial<Wizard> }>(),

    "Cancel": props<{ id: string }>(),
    "Cancel Success": props<{ id: string }>(),
    "Cancel Failure": props<{ id: string, error?: Error }>(),

    "Previous": props<{ id: string, index: number }>(),
    "Previous Success": props<{ id: string, index: number }>(),
    "Previous Failure": props<{ id: string, index: number, error?: Error }>(),

    "Next": props<{ id: string, index: number }>(),
    "Next Success": props<{ id: string, index: number }>(),
    "Next Failure": props<{ id: string, index: number, error?: Error }>(),

    "Finish": props<{ id: string }>(),
    "Finish Success": props<{ id: string }>(),
    "Finish Failure": props<{ id: string, error?: Error }>()
  }
});
