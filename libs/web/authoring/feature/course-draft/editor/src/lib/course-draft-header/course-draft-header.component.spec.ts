import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftHeaderComponent } from "./course-draft-header.component";

describe("CourseDraftHeaderComponent", () => {
  let component: CourseDraftHeaderComponent;
  let fixture: ComponentFixture<CourseDraftHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
