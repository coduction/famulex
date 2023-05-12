import { CommonModule } from "@angular/common";
import { Component }    from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "administration-shell",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./administration-shell.component.html",
  styleUrls: ["./administration-shell.component.scss"]
})
export class AdministrationShellComponent {
}
