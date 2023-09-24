import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftNodeQuizComponent } from "./course-draft-node-quiz.component";

describe("CourseDraftNodeQuizComponent", () => {
  let component: CourseDraftNodeQuizComponent;
  let fixture: ComponentFixture<CourseDraftNodeQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftNodeQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftNodeQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
