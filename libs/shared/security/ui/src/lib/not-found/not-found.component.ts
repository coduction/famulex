import { CommonModule }         from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { Router, RouterLink }   from "@angular/router";
import { ButtonModule }         from "primeng/button";

@Component({
  selector: "security-not-found",
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"]
})
export class NotFoundComponent implements OnDestroy {

  interval: number | undefined;
  countDown = 5;

  constructor(private router: Router) {
    this.interval = setInterval(() => {
      this.countDown--;
      if (this.countDown === 0) {
        this.onFinishCountdown();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }

  onFinishCountdown(): void {
    this.cleanUp();
    void this.router.navigate(["/"]);
  }

  cleanUp(): void {
    if (this.interval != undefined) {
      clearInterval(this.interval);
    }
  }
}
