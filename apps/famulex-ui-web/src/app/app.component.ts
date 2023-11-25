import { Component }          from "@angular/core";
import { RouterModule }       from "@angular/router";
import { PrimeNGConfig }      from "primeng/api";
import { NxWelcomeComponent } from "./nx-welcome.component";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: "famulex-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {

  constructor(primeConfig: PrimeNGConfig) {
    primeConfig.ripple = true;
  }
}
