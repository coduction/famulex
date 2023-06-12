import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RoleAssignmentsGroupEditComponent } from "./role-assignments-group-edit.component";

describe("RoleAssignmentsGroupEditComponent", () => {
  let component: RoleAssignmentsGroupEditComponent;
  let fixture: ComponentFixture<RoleAssignmentsGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleAssignmentsGroupEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleAssignmentsGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
