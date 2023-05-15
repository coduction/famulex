import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { ConfirmationService }                     from "@coduction/primeng/api";
import { AuthService }                             from "@famulex/shared/security/util";
import { LayoutService }                           from "../layout/layout.service";

@Component({
  selector: "layout-topbar",
  templateUrl: "./topbar.component.html"
})
export class TopbarComponent {

  @Input() profilePicture?: string;
  @ViewChild("menuButton") menuButton!: ElementRef;

  constructor(public layoutService: LayoutService,
              public confirmationService: ConfirmationService,
              public authService: AuthService) {
  }

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  onProfileButtonClick() {
    this.layoutService.showProfileSidebar();
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  onLogout(event: Event) {
    if (!event.target) {
      return;
    }

    this.confirmationService.confirm({
      target: event.target,
      message: $localize`Do you want to logout?`,
      icon: "fa fa-power-off",
      accept: () => this.authService.logout()
    });
  }

}
