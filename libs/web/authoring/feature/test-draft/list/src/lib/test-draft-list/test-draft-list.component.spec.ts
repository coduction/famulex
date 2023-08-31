import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestDraftListComponent }    from "./test-draft-list.component";

describe("ListComponent", () => {
  let component: TestDraftListComponent;
  let fixture: ComponentFixture<TestDraftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDraftListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestDraftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
