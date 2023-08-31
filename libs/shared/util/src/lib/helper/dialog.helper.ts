import { DynamicDialogRef } from "@coduction/primeng/dynamicdialog";

export interface DialogButton {
  label: string;
  icon?: string;
  hidden?: boolean;
  disabled: boolean;
  loading: boolean;
}

export interface DialogOptions {
  buttons?: DialogButton[];
  activeButton?: DialogButton;

  dialogRef?: DynamicDialogRef;
}
