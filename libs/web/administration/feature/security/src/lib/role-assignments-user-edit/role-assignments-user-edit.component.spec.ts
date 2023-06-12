import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RoleAssignmentsUserEditComponent } from "./role-assignments-user-edit.component";

describe("RoleAssignmentsUserEditComponent", () => {
  let component: RoleAssignmentsUserEditComponent;
  let fixture: ComponentFixture<RoleAssignmentsUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleAssignmentsUserEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleAssignmentsUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
