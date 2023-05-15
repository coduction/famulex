import { Component, OnInit } from "@angular/core";
import { MenuItem }          from "@coduction/primeng/api";
import { MenuService }       from "./menu.service";

@Component({
  selector: "layout-menu",
  templateUrl: "./menu.component.html"
})
export class MenuComponent implements OnInit {

  model: MenuItem[] = [];

  constructor(private menuService: MenuService) {
  }

  ngOnInit() {
    this.model = this.menuService.createMenu();
  }
}
