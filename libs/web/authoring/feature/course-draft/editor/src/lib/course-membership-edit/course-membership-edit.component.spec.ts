import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseMembershipEditComponent } from "./course-membership-edit.component";

describe("CourseMembershipEditComponent", () => {
  let component: CourseMembershipEditComponent;
  let fixture: ComponentFixture<CourseMembershipEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseMembershipEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseMembershipEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
