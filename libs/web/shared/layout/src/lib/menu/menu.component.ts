import { Component, OnInit } from "@angular/core";

@Component({
  selector: "layout-menu",
  templateUrl: "./menu.component.html"
})
export class MenuComponent implements OnInit {

  model: any[] = [];

  ngOnInit() {
    this.model = [
      {
        label: "Dashboards",
        icon: "pi pi-home",
        items: [
          {
            label: "E-Commerce",
            icon: "pi pi-fw pi-home",
            routerLink: ["/home"]
          },
          {
            label: "Banking",
            icon: "pi pi-fw pi-image",
            routerLink: ["/dashboard-banking"],
            items: [
              {
                label: "Dashboards",
                icon: "pi pi-home",
                items: [
                  {
                    label: "E-Commerce",
                    icon: "pi pi-fw pi-home",
                    routerLink: ["/"]
                  },
                  {
                    label: "Banking",
                    icon: "pi pi-fw pi-image",
                    routerLink: ["/dashboard-banking"]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        separator: true
      },
      {
        label: "Dashboards",
        icon: "pi pi-home",
        items: [
          {
            label: "E-Commerce",
            icon: "pi pi-fw pi-home",
            routerLink: ["/"]
          },
          {
            label: "Banking",
            icon: "pi pi-fw pi-image",
            routerLink: ["/dashboard-banking"],
            items: [
              {
                label: "Dashboards",
                icon: "pi pi-home",
                items: [
                  {
                    label: "E-Commerce",
                    icon: "pi pi-fw pi-home",
                    routerLink: ["/"]
                  },
                  {
                    label: "Banking",
                    icon: "pi pi-fw pi-image",
                    routerLink: ["/dashboard-banking"]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        label: "Dashboards",
        icon: "pi pi-home",
        items: [
          {
            label: "E-Commerce",
            icon: "pi pi-fw pi-home",
            routerLink: ["/"]
          },
          {
            label: "Banking",
            icon: "pi pi-fw pi-image",
            routerLink: ["/dashboard-banking"],
            items: [
              {
                label: "Dashboards",
                icon: "pi pi-home",
                items: [
                  {
                    label: "E-Commerce",
                    icon: "pi pi-fw pi-home",
                    routerLink: ["/"]
                  },
                  {
                    label: "Banking",
                    icon: "pi pi-fw pi-image",
                    routerLink: ["/dashboard-banking"]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }
}
