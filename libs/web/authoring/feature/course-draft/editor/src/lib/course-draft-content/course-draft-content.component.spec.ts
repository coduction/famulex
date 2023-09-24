import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftContentComponent } from "./course-draft-content.component";

describe("CourseDraftContentComponent", () => {
  let component: CourseDraftContentComponent;
  let fixture: ComponentFixture<CourseDraftContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
