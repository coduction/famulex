import { Injectable } from "@angular/core";

@Injectable()
export abstract class CellRenderer<C> {

  private _data: C | null | undefined;

  get data() {
    return this._data;
  }

  set data(data: C | null | undefined) {
    this._data = data;

    this.onSetData(data);
  }

  onSetData(data: C | null | undefined) {
    // Override this method to react to data changes
  }
}
