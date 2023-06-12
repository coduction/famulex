import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RoleCreateWizardComponent } from "./role-create-wizard.component";

describe("RoleCreateWizardComponent", () => {
  let component: RoleCreateWizardComponent;
  let fixture: ComponentFixture<RoleCreateWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleCreateWizardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleCreateWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
