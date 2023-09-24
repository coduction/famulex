import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftNodeContentComponent } from "./course-draft-node-content.component";

describe("CourseDraftNodeContentComponent", () => {
  let component: CourseDraftNodeContentComponent;
  let fixture: ComponentFixture<CourseDraftNodeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftNodeContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftNodeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
