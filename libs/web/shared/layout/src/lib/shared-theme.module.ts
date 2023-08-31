import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule }                       from "@angular/core";
import { FormsModule }                    from "@angular/forms";
import { RouterModule }                   from "@angular/router";
import { BadgeModule }                    from "@coduction/primeng/badge";
import { ButtonModule }                   from "@coduction/primeng/button";
import { ConfirmDialogModule }            from "@coduction/primeng/confirmdialog";
import { ConfirmPopupModule }             from "@coduction/primeng/confirmpopup";
import { InputSwitchModule }              from "@coduction/primeng/inputswitch";
import { InputTextModule }                from "@coduction/primeng/inputtext";
import { OverlayPanelModule }             from "@coduction/primeng/overlaypanel";
import { RadioButtonModule }              from "@coduction/primeng/radiobutton";
import { RippleModule }                   from "@coduction/primeng/ripple";
import { SidebarModule }                  from "@coduction/primeng/sidebar";
import { ToastModule }                    from "@coduction/primeng/toast";
import { TooltipModule }                  from "@coduction/primeng/tooltip";
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
