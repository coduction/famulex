import { Component, OnDestroy, Renderer2, ViewChild } from "@angular/core";
import { NavigationEnd, Router }                      from "@angular/router";
import { BehaviorSubject, filter, Subscription }      from "rxjs";
import { MenuService }                                from "../../menu/menu.service";
import { SidebarLeftComponent }                       from "../../sidebar-left/sidebar-left.component";
import { TopbarComponent }                            from "../../topbar/topbar.component";
import { LayoutService }                              from "../layout.service";

@Component({
  selector: "layout-main-layout",
  templateUrl: "./main-layout.component.html"
})
export class MainLayoutComponent implements OnDestroy {

  static ScrollEvents$ = new BehaviorSubject<ScrollDirection>("UP");

  @ViewChild(SidebarLeftComponent) sidebarLeft!: SidebarLeftComponent;
  @ViewChild(TopbarComponent) topbar!: TopbarComponent;

  overlayMenuOpenSubscription: Subscription;
  menuOutsideClickListener: any;
  menuScrollListener: any;

  prevScrollPosition = window.scrollY;
  prevScrollDirection?: ScrollDirection;
  scrollGuard?: ReturnType<typeof setTimeout>;

  constructor(private menuService: MenuService, public layoutService: LayoutService, public renderer: Renderer2, public router: Router) {
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen("document", "click", event => {
          const isOutsideClicked = !(this.sidebarLeft.el.nativeElement.isSameNode(event.target) || this.sidebarLeft.el.nativeElement.contains(event.target)
            || this.topbar.menuButton.nativeElement.isSameNode(event.target) || this.topbar.menuButton.nativeElement.contains(event.target));
          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }

      if ((this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus()) && !this.menuScrollListener) {
        this.menuScrollListener = this.renderer.listen(this.sidebarLeft.menuContainer.nativeElement, "scroll", event => {
          if (this.layoutService.isDesktop()) {
            this.hideMenu();
          }
        });
      }

      if (this.layoutService.state.staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
      });

    // Add a scroll event listener
    window.addEventListener("scroll", () => {
      // Get the current scroll position
      const currentScrollPosition = window.scrollY;
      let scrollDirection: ScrollDirection | undefined;

      // Check if the user is scrolling up or down
      if (currentScrollPosition < this.prevScrollPosition) {
        scrollDirection = "UP";
      } else if (currentScrollPosition > this.prevScrollPosition) {
        scrollDirection = "DOWN";
      }

      if (!scrollDirection) {
        return;
      }

      // Only emit the scroll event if the scroll direction has changed
      if (!this.scrollGuard && scrollDirection != this.prevScrollDirection) {
        this.prevScrollDirection = scrollDirection;

        MainLayoutComponent.ScrollEvents$.next(scrollDirection);

        // Set a guard to prevent the scroll event from being emitted too often
        this.scrollGuard = setTimeout(() => {
          this.scrollGuard = undefined;
        }, 300);
      }

      // Update the previous scroll position
      this.prevScrollPosition = currentScrollPosition;
    });
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add("blocked-scroll");
    } else {
      document.body.className += " blocked-scroll";
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove("blocked-scroll");
    } else {
      document.body.className = document.body.className.replace(new RegExp("(^|\\b)" +
        "blocked-scroll".split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    this.menuService.reset();

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }

    if (this.menuScrollListener) {
      this.menuScrollListener();
      this.menuScrollListener = null;
    }

    this.unblockBodyScroll();
  }

  get containerClass() {
    return {
      "layout-light": this.layoutService.config.colorScheme === "light",
      "layout-dim": this.layoutService.config.colorScheme === "dim",
      "layout-dark": this.layoutService.config.colorScheme === "dark",
      "layout-colorscheme-menu": this.layoutService.config.menuTheme === "colorScheme",
      "layout-primarycolor-menu": this.layoutService.config.menuTheme === "primaryColor",
      "layout-transparent-menu": this.layoutService.config.menuTheme === "transparent",
      "layout-overlay": this.layoutService.config.menuMode === "overlay",
      "layout-static": this.layoutService.config.menuMode === "static",
      "layout-slim": this.layoutService.config.menuMode === "slim",
      "layout-slim-plus": this.layoutService.config.menuMode === "slim-plus",
      "layout-horizontal": this.layoutService.config.menuMode === "horizontal",
      "layout-reveal": this.layoutService.config.menuMode === "reveal",
      "layout-drawer": this.layoutService.config.menuMode === "drawer",
      "layout-static-inactive": this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === "static",
      "layout-overlay-active": this.layoutService.state.overlayMenuActive,
      "layout-mobile-active": this.layoutService.state.staticMenuMobileActive,
      "p-input-filled": this.layoutService.config.inputStyle === "filled",
      "p-ripple-disabled": !this.layoutService.config.ripple,
      "layout-sidebar-active": this.layoutService.state.sidebarActive,
      "layout-sidebar-anchored": this.layoutService.state.anchored
    };
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }

  get scrollEvents$() {
    return MainLayoutComponent.ScrollEvents$.asObservable();
  }


}

export type ScrollDirection = "UP" | "DOWN";
