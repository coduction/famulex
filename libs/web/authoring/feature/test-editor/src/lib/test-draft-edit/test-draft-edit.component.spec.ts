import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestDraftEditComponent } from "./test-draft-edit.component";

describe("TestDraftEditComponent", () => {
  let component: TestDraftEditComponent;
  let fixture: ComponentFixture<TestDraftEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDraftEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDraftEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
