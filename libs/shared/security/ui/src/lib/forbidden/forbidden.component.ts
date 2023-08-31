import { CommonModule }                   from "@angular/common";
import { Component, OnDestroy, Optional } from "@angular/core";
import { Router, RouterLink }             from "@angular/router";
import { ButtonModule }                   from "@coduction/primeng/button";
import { DynamicDialogRef }               from "@coduction/primeng/dynamicdialog";

@Component({
  selector: "security-forbidden",
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: "./forbidden.component.html",
  styleUrls: ["./forbidden.component.scss"]
})
export class ForbiddenComponent implements OnDestroy {

  interval: number | undefined;
  countDown = 5;

  constructor(private router: Router,
              @Optional() private dialogRef?: DynamicDialogRef) {
    this.interval = setInterval(() => {
      this.countDown--;
      if (this.countDown === 0) {
        this.skipCountDown();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }

  skipCountDown(): void {
    this.cleanUp();
    void this.router.navigate(["/"]);
  }

  cleanUp(): void {
    if (this.interval != undefined) {
      clearInterval(this.interval);
    }

    this.dialogRef?.close();
  }
}
