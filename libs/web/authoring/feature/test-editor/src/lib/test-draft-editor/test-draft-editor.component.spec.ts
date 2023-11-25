import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestDraftEditorComponent } from "./test-draft-editor.component";

describe("TestDraftEditorComponent", () => {
  let component: TestDraftEditorComponent;
  let fixture: ComponentFixture<TestDraftEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDraftEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDraftEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
