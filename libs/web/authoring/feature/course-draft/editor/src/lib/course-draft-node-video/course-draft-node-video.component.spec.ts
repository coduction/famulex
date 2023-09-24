import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftNodeVideoComponent } from "./course-draft-node-video.component";

describe("CourseDraftNodeVideoComponent", () => {
  let component: CourseDraftNodeVideoComponent;
  let fixture: ComponentFixture<CourseDraftNodeVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftNodeVideoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftNodeVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
