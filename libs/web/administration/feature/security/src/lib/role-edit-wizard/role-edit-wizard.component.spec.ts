import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RoleEditWizardComponent } from "./role-edit-wizard.component";

describe("RoleEditWizardComponent", () => {
  let component: RoleEditWizardComponent;
  let fixture: ComponentFixture<RoleEditWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleEditWizardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleEditWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
