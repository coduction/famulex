import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QuestionDraftEditComponent } from "./question-draft-edit.component";

describe("QuestionDraftEditComponent", () => {
  let component: QuestionDraftEditComponent;
  let fixture: ComponentFixture<QuestionDraftEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDraftEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionDraftEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
