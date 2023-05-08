import { CommonModule }   from "@angular/common";
import { Component }      from "@angular/core";
import { NgrxTestFacade } from "../+state/ngrx-test.facade";

@Component({
  selector: "famulex-ngrx-test",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ngrx-test.component.html",
  styleUrls: ["./ngrx-test.component.css"]
})
export class NgrxTestComponent {

  constructor(public ngrxTestFacade: NgrxTestFacade) {

    setTimeout(() => this.ngrxTestFacade.init(), 2000);
  }
}
