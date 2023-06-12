import { CommonModule }                                                              from "@angular/common";
import { Component, ComponentRef, Input, OnDestroy, OnInit, Type, ViewContainerRef } from "@angular/core";
import { CellRenderer }                                                              from "@famulex/web/shared/table";

@Component({
  selector: "web-table-cell-renderer-wrapper",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./cell-renderer-wrapper.component.html",
  styleUrls: ["./cell-renderer-wrapper.component.scss"]
})
export class CellRendererWrapperComponent<C> implements OnInit, OnDestroy {

  @Input({ required: true }) renderer!: Type<CellRenderer<C>>;
  @Input({ required: true }) data?: C;

  private _cellRendererComponentRef?: ComponentRef<CellRenderer<C>>;

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this._cellRendererComponentRef = this.viewContainerRef.createComponent(this.renderer);
    this._cellRendererComponentRef.instance.data = this.data;
  }

  ngOnDestroy(): void {
    this._cellRendererComponentRef?.destroy();
  }
}
