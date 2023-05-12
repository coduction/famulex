import { CommonModule }       from "@angular/common";
import { Component }          from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule }       from "@coduction/primeng/button";

@Component({
  selector: "security-not-found",
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"]
})
export class NotFoundComponent {

  countDown = 5;

  constructor(private router: Router) {
    setInterval(() => {
      this.countDown--;
      if (this.countDown === 0) {
        void this.router.navigate(["/"]);
      }
    }, 1000);
  }
}
