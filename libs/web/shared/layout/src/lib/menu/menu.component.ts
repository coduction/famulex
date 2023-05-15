import { Component, OnInit } from "@angular/core";
import { $localize }         from "@angular/localize/init";

@Component({
  selector: "layout-menu",
  templateUrl: "./menu.component.html"
})
export class MenuComponent implements OnInit {

  model: any[] = [];

  ngOnInit() {
    this.model = [
      {
        label: $localize`Settings`,
        icon: "fa fa-fw fa-cog",
        items: [
          {
            label: $localize`Administration`,
            icon: "fa fa-fw fa-cog",
            routerLink: ["/administration"],
            items: [
              {
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
            ]
          }
        ]
      }
    ];
  }
}
