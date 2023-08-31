import { Injectable }  from "@angular/core";
import { MenuItem }    from "@coduction/primeng/api";
import { Right }       from "@famulex/shared/famulex-api-client";
import { AuthService } from "@famulex/shared/security/util";
import { Subject }     from "rxjs";
import {
  accessCertificates, administration, administrationGroups, administrationLibraries, administrationRoles, administrationUsers, authoringCourses, authoringTests, checkCertificates, dashboard,
  myCourses, rootAuthoring, rootCertificates, rootHome, rootLibrary, rootSettings, testResults
}                      from "./menu.entries";

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

    // Home
    this._createHomeMenu(rights, this.menu);

    // Library
    this._createLibraryMenu(rights, this.menu);

    // Certificates
    this._createCertificatesMenu(rights, this.menu);

    // Authoring
    this._createAuthoringMenu(rights, this.menu);

    // Settings
    this._createSettingsMenu(rights, this.menu);

    return this.menu;
  }

  /**************************************************************************
   * Home
   *************************************************************************/
  private _createHomeMenu(rights: Right[], menu: MenuItem[]) {
    rootHome.items = [];

    if (rights.includes(Right.AccessCourses) || rights.includes(Right.AccessTests)) {
      rootHome.items.push(dashboard);
    }

    if (rights.includes(Right.AccessCourses)) {
      rootHome.items.push(myCourses);
    }

    if (rights.includes(Right.AccessTests)) {
      rootHome.items.push(testResults);
    }

    if (rootHome.items.length > 0) {
      menu.push(rootHome);
    }
  }

  /**************************************************************************
   * Library
   *************************************************************************/
  private _createLibraryMenu(rights: Right[], menu: MenuItem[]) {
    rootLibrary.items = [];

    // Check library access

    // if (rights.includes(Right.AccessLibrary)) {
    //   rootLibrary.items.push(library);
    // }

    if (rootLibrary.items.length > 0) {
      menu.push(rootLibrary);
    }
  }

  /**************************************************************************
   * Certificates
   *************************************************************************/
  private _createCertificatesMenu(rights: Right[], menu: MenuItem[]) {
    rootCertificates.items = [];

    if (rights.includes(Right.AccessCertificates)) {
      rootCertificates.items.push(accessCertificates);
    }

    if (rights.includes(Right.CheckCertificates)) {
      rootCertificates.items.push(checkCertificates);
    }

    if (rootCertificates.items.length > 0) {
      menu.push(rootCertificates);
    }
  }

  /**************************************************************************
   * Authoring
   *************************************************************************/
  private _createAuthoringMenu(rights: Right[], menu: MenuItem[]) {
    rootAuthoring.items = [];

    if (rights.includes(Right.CreateCourses) || rights.includes(Right.ManageCourses)) {
      rootAuthoring.items.push(authoringCourses);
    }

    if (rights.includes(Right.CreateTests) || rights.includes(Right.ManageTests)) {
      rootAuthoring.items.push(authoringTests);
    }

    if (rootAuthoring.items.length > 0) {
      menu.push(rootAuthoring);
    }
  }

  /**************************************************************************
   * Settings
   *************************************************************************/
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

    if (rights.includes(Right.ManageGroups)) {
      administration.items.push(administrationGroups);
    }

    if (rights.includes(Right.ManageRoles)) {
      administration.items.push(administrationRoles);
    }

    if (rights.includes(Right.ManageLibraries)) {
      administration.items.push(administrationLibraries);
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
