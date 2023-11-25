import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestDraftNodeEditComponent } from "./test-draft-node-edit.component";

describe("TestDraftNodeEditComponent", () => {
  let component: TestDraftNodeEditComponent;
  let fixture: ComponentFixture<TestDraftNodeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDraftNodeEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDraftNodeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
