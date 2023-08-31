import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftOverviewComponent } from "./course-draft-overview.component";

describe("CourseDraftOverviewComponent", () => {
  let component: CourseDraftOverviewComponent;
  let fixture: ComponentFixture<CourseDraftOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
