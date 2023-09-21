import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftMembershipsComponent } from "./course-draft-memberships.component";

describe("CourseDraftMembershipsComponent", () => {
  let component: CourseDraftMembershipsComponent;
  let fixture: ComponentFixture<CourseDraftMembershipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftMembershipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftMembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
