import { ComponentFixture, TestBed }      from "@angular/core/testing";
import { RoleAssignmentsManageComponent } from "./role-assignments-manage.component";

describe("RoleManageUsersComponent", () => {
  let component: RoleAssignmentsManageComponent;
  let fixture: ComponentFixture<RoleAssignmentsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleAssignmentsManageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RoleAssignmentsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
