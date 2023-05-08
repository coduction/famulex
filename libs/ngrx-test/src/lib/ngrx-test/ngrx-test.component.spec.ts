import { ComponentFixture, TestBed }         from "@angular/core/testing";
import { NgrxTestComponent, NgrxTestFacade } from "@famulex/ngrx-test";
import { provideMockStore }                  from "@ngrx/store/testing";

describe("NgrxTestComponent", () => {
  let component: NgrxTestComponent;
  let fixture: ComponentFixture<NgrxTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgrxTestComponent],
      providers: [
        provideMockStore(),
        NgrxTestFacade
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgrxTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
