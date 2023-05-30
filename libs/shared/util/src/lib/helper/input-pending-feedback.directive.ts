import { DestroyRef, Directive, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { takeUntilDestroyed }                                   from "@angular/core/rxjs-interop";
import { NgControl }                                            from "@angular/forms";

@Directive({
  selector: "[inputPendingFeedback]",
  standalone: true
})
export class InputPendingFeedbackDirective implements OnInit {

  private wrapper?: HTMLElement;
  private spinnerIcon?: HTMLElement;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private ngControl: NgControl,
              private destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    this.wrapInputElement();

    this.ngControl.statusChanges?.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.updateSpinnerIcon());
  }

  private wrapInputElement(): void {
    if (!this.wrapper) {
      this.wrapper = this.renderer.createElement("span");
      this.renderer.insertBefore(this.el.nativeElement.parentNode, this.wrapper, this.el.nativeElement);
      this.renderer.appendChild(this.wrapper, this.el.nativeElement);
    }
  }

  private addSpinnerIcon(): void {
    if (!this.spinnerIcon && this.wrapper) {
      this.renderer.addClass(this.wrapper, "p-input-icon-right");

      this.spinnerIcon = this.renderer.createElement("i");
      this.renderer.addClass(this.spinnerIcon, "fa");
      this.renderer.addClass(this.spinnerIcon, "fa-spin");
      this.renderer.addClass(this.spinnerIcon, "fa-rotate");
      this.renderer.addClass(this.spinnerIcon, "text-primary");
      this.renderer.appendChild(this.wrapper, this.spinnerIcon);
    }
  }

  private removeSpinnerIcon(): void {
    if (this.wrapper && this.spinnerIcon) {
      this.renderer.removeClass(this.wrapper, "p-input-icon-right");
      this.renderer.removeChild(this.wrapper, this.spinnerIcon);
      this.spinnerIcon = undefined;
    }
  }

  private updateSpinnerIcon(): void {
    if (this.ngControl.pending) {
      this.addSpinnerIcon();
    } else {
      this.removeSpinnerIcon();
    }
  }
}
