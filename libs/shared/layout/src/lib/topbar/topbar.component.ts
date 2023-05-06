import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { LayoutService }                           from "../layout/layout.service";

@Component({
  selector: "layout-topbar",
  templateUrl: "./topbar.component.html"
})
export class TopbarComponent {

  @Input() profilePicture?: string;
  @ViewChild("menuButton") menuButton!: ElementRef;

  constructor(public layoutService: LayoutService) {
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

}
