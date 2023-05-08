import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgrxTestComponent } from "./ngrx-test.component";

describe("NgrxTestComponent", () => {
  let component: NgrxTestComponent;
  let fixture: ComponentFixture<NgrxTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgrxTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgrxTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
