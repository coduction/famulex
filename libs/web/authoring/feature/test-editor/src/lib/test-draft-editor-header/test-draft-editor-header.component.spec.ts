import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestDraftEditorHeaderComponent } from "./test-draft-editor-header.component";

describe("TestDraftEditorHeaderComponent", () => {
  let component: TestDraftEditorHeaderComponent;
  let fixture: ComponentFixture<TestDraftEditorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDraftEditorHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDraftEditorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
