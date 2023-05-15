import { Injectable }  from "@angular/core";
import { $localize }   from "@angular/localize/init";
import { MenuItem }    from "@coduction/primeng/api";
import { Right }       from "@famulex/shared/famulex-api-client";
import { AuthService } from "@famulex/shared/security/util";
import { Subject }     from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MenuService {

  private menuSource = new Subject<MenuChangeEvent>();
  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  menu: MenuItem[] = [];

  constructor(private authService: AuthService) {
  }

  loadMenu() {
    const rights = this.authService.rights;
    this.menu = [];

    // Settings
    if (rights.includes(Right.ManageUsers)) {
      const administrationItems: MenuItem[] = [];
      const administration: MenuItem = {
        label: $localize`Settings`,
        icon: "fa fa-fw fa-cog",
        items: [
          {
            label: $localize`Administration`,
            icon: "fa fa-fw fa-cog",
            routerLink: ["/administration"],
            items: administrationItems
          }
        ]
      };

      if (rights.includes(Right.ManageUsers)) {
        administrationItems.push({
            label: $localize`Users`,
            icon: "fa fa-fw fa-user",
            routerLink: ["/administration/users"]
          },
          {
            label: $localize`Groups`,
            icon: "fa fa-fw fa-users",
            routerLink: ["/administration/groups"]
          },
          {
            label: $localize`Roles`,
            icon: "fa fa-fw fa-shield-quartered",
            routerLink: ["/administration/roles"]
          }
        );
      }

      this.menu.push(administration);
    }

    return this.menu;
  }

  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }
}

export interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}
