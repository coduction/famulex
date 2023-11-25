import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[uiStopClickPropagation]",
  standalone: true
})
export class StopClickPropagationDirective {
  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
