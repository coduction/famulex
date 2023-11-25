import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule }                       from "@angular/core";
import { FormsModule }                    from "@angular/forms";
import { RouterModule }                   from "@angular/router";
import { BadgeModule }                    from "primeng/badge";
import { ButtonModule }                   from "primeng/button";
import { ConfirmDialogModule }            from "primeng/confirmdialog";
import { ConfirmPopupModule }             from "primeng/confirmpopup";
import { InputSwitchModule }              from "primeng/inputswitch";
import { InputTextModule }                from "primeng/inputtext";
import { OverlayPanelModule }             from "primeng/overlaypanel";
import { RadioButtonModule }              from "primeng/radiobutton";
import { RippleModule }                   from "primeng/ripple";
import { SidebarModule }                  from "primeng/sidebar";
import { ToastModule }                    from "primeng/toast";
import { TooltipModule }                  from "primeng/tooltip";
import { BreadcrumbComponent }            from "./breadcrumb/breadcrumb.component";
import { ConfigComponent }                from "./config/config.component";
import { MenuItemComponent }              from "./menu-item/menu-item.component";
import { MenuComponent }                  from "./menu/menu.component";
import { SidebarLeftComponent }           from "./sidebar-left/sidebar-left.component";
import { SidebarRightComponent }          from "./sidebar-right/sidebar-right.component";
import { TopbarComponent }                from "./topbar/topbar.component";

@NgModule({
  imports: [
    BadgeModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    NgOptimizedImage,
    RadioButtonModule,
    RippleModule,
    RouterModule,
    SidebarModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    ConfirmPopupModule,
    OverlayPanelModule
  ],
  declarations: [
    BreadcrumbComponent,
    ConfigComponent,
    MenuComponent,
    MenuItemComponent,
    SidebarLeftComponent,
    SidebarRightComponent,
    TopbarComponent
  ],
  exports: [
    BreadcrumbComponent,
    ConfigComponent,
    MenuComponent,
    MenuItemComponent,
    SidebarLeftComponent,
    SidebarRightComponent,
    TopbarComponent
  ]
})
export class SharedThemeModule {
}
