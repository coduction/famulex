import { Injectable }                                                                                   from "@angular/core";
import { MenuItem }                                                                                     from "@coduction/primeng/api";
import { Right }                                                                                        from "@famulex/shared/famulex-api-client";
import { AuthService }                                                                                  from "@famulex/shared/security/util";
import { Subject }                                                                                      from "rxjs";
import { administration, administrationGroups, administrationRoles, administrationUsers, rootSettings } from "./menu.entries";

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

  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }

  createMenu() {
    const rights = this.authService.rights;
    this.menu = [];

    // Settings
    this._createSettingsMenu(rights, this.menu);

    return this.menu;
  }

  private _createSettingsMenu(rights: Right[], menu: MenuItem[]) {
    rootSettings.items = [];

    this._createAdministrationMenu(rights, rootSettings);

    if (rootSettings.items.length > 0) {
      menu.push(rootSettings);
    }
  }

  private _createAdministrationMenu(rights: Right[], settingsMenuItem: MenuItem) {
    administration.items = [];

    if (rights.includes(Right.ManageUsers)) {
      administration.items.push(administrationUsers);
    }

    if (rights.includes(Right.ManageUsers)) {
      administration.items.push(administrationGroups);
    }

    if (rights.includes(Right.ManageUsers)) {
      administration.items.push(administrationRoles);
    }

    if (administration.items.length > 0) {
      settingsMenuItem.items?.push(administration);
    }
  }


}

export interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}
