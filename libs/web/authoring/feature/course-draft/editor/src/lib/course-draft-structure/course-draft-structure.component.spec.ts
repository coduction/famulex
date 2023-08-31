import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftStructureComponent } from "./course-draft-structure.component";

describe("CourseDraftStructureComponent", () => {
  let component: CourseDraftStructureComponent;
  let fixture: ComponentFixture<CourseDraftStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftStructureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
