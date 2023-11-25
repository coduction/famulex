import { LocationStrategy }                        from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { ConfirmationService }                     from "primeng/api";
import { AuthService }                             from "@famulex/shared/security/util";
import { LayoutService }                           from "../layout/layout.service";

@Component({
  selector: "layout-topbar",
  templateUrl: "./topbar.component.html"
})
export class TopbarComponent {

  @Input() profilePicture?: string;
  @ViewChild("menuButton") menuButton!: ElementRef;

  constructor(private locationStrategy: LocationStrategy,
              private layoutService: LayoutService,
              private confirmationService: ConfirmationService,
              private authService: AuthService) {
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

  onChangeLanguage(newLanguage: string) {
    const baseHref = this.locationStrategy.getBaseHref();

    if (baseHref === "/") {
      return;
    }

    const url = window.location.href;
    window.location.href = url.replace(baseHref, `/${newLanguage}/`);
  }
}
