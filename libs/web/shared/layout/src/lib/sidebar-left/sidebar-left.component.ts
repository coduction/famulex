import { Component, ElementRef, ViewChild } from "@angular/core";
import { SystemInfoState }                  from "@famulex/shared/system-info";
import { Store }                            from "@ngrx/store";
import { LayoutService }                    from "../layout/layout.service";

@Component({
  selector: "layout-sidebar-left",
  templateUrl: "./sidebar-left.component.html"
})
export class SidebarLeftComponent {

  @ViewChild("menuContainer") menuContainer!: ElementRef;

  timeout: any = null;

  logoUrl$ = this.store.select(SystemInfoState.selectLogoUrl);
  compactLogoUrl$ = this.store.select(SystemInfoState.selectCompactLogoUrl);

  constructor(public layoutService: LayoutService,
              public store: Store,
              public el: ElementRef) {
  }


  onMouseEnter() {
    if (!this.layoutService.state.anchored) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.layoutService.state.sidebarActive = true;


    }
  }

  onMouseLeave() {
    if (!this.layoutService.state.anchored) {
      if (!this.timeout) {
        this.timeout = setTimeout(() => this.layoutService.state.sidebarActive = false, 300);
      }
    }
  }

  anchor() {
    this.layoutService.state.anchored = !this.layoutService.state.anchored;
  }

}
