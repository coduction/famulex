import { Component }     from "@angular/core";
import { AuthService }   from "@famulex/shared/keycloak";
import { LayoutService } from "../layout/layout.service";

@Component({
  selector: "layout-sidebar-right",
  templateUrl: "./sidebar-right.component.html"
})
export class SidebarRightComponent {

  constructor(public layoutService: LayoutService,
              public authService: AuthService) {
  }

  get visible(): boolean {
    return this.layoutService.state.profileSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.profileSidebarVisible = _val;
  }
}
