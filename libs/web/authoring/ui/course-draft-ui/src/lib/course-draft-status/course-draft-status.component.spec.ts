import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftStatusComponent } from "./course-draft-status.component";

describe("CourseDraftStatusComponent", () => {
  let component: CourseDraftStatusComponent;
  let fixture: ComponentFixture<CourseDraftStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
