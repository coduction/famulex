import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "administration-role-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./role-list.component.html",
  styleUrls: ["./role-list.component.scss"],
})
export class RoleListComponent {}
