import { Component }          from "@angular/core";
import { RouterModule }       from "@angular/router";
import { PrimeNGConfig }      from "@coduction/primeng/api";
import { NxWelcomeComponent } from "./nx-welcome.component";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: "famulex-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "famulex-ui-web";

  constructor(primeConfig: PrimeNGConfig) {
    primeConfig.ripple = true;
  }
}
