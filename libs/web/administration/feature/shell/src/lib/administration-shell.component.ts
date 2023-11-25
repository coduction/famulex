import { CommonModule }             from "@angular/common";
import { Component }                from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { CardModule }               from "primeng/card";

@Component({
  selector: "administration-shell",
  standalone: true,
  imports: [CommonModule, RouterOutlet, CardModule, RouterLink],
  templateUrl: "./administration-shell.component.html",
  styleUrls: ["./administration-shell.component.scss"]
})
export class AdministrationShellComponent {
}
