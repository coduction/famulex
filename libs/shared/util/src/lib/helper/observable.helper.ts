import { Injectable, OnDestroy } from "@angular/core";
import { Subject }               from "rxjs";

@Injectable()
export abstract class Destroy implements OnDestroy {

  protected readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Injectable()
export abstract class Reset extends Destroy implements OnDestroy {

  protected readonly reset$ = new Subject<void>();

  override ngOnDestroy(): void {
    this.reset$.next();
    this.reset$.complete();

    super.ngOnDestroy();
  }
}
