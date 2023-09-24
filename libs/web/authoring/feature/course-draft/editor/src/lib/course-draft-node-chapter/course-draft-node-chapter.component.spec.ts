import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftNodeChapterComponent } from "./course-draft-node-chapter.component";

describe("CourseDraftNodeChapterComponent", () => {
  let component: CourseDraftNodeChapterComponent;
  let fixture: ComponentFixture<CourseDraftNodeChapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftNodeChapterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftNodeChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
