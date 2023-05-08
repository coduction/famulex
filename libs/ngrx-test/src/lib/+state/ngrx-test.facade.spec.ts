import { NgModule } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule, Store } from "@ngrx/store";
import { readFirst } from "@nx/angular/testing";

import * as NgrxTestActions from "./ngrx-test.actions";
import { NgrxTestEffects } from "./ngrx-test.effects";
import { NgrxTestFacade } from "./ngrx-test.facade";
import { NgrxTestEntity } from "./ngrx-test.models";
import {
  NGRX_TEST_FEATURE_KEY,
  NgrxTestState,
  initialNgrxTestState,
  ngrxTestReducer,
} from "./ngrx-test.reducer";
import * as NgrxTestSelectors from "./ngrx-test.selectors";

interface TestSchema {
  ngrxTest: NgrxTestState;
}

describe("NgrxTestFacade", () => {
  let facade: NgrxTestFacade;
  let store: Store<TestSchema>;
  const createNgrxTestEntity = (id: string, name = ""): NgrxTestEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe("used in NgModule", () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(NGRX_TEST_FEATURE_KEY, ngrxTestReducer),
          EffectsModule.forFeature([NgrxTestEffects]),
        ],
        providers: [NgrxTestFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(NgrxTestFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it("loadAll() should return empty list with loaded == true", async () => {
      let list = await readFirst(facade.allNgrxTest$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allNgrxTest$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadNgrxTestSuccess` to manually update list
     */
    it("allNgrxTest$ should return the loaded list; and loaded flag == true", async () => {
      let list = await readFirst(facade.allNgrxTest$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        NgrxTestActions.loadNgrxTestSuccess({
          ngrxTest: [createNgrxTestEntity("AAA"), createNgrxTestEntity("BBB")],
        })
      );

      list = await readFirst(facade.allNgrxTest$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
