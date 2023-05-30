import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WizardButtonsComponent } from "./wizard-buttons.component";

describe("WizardButtonsComponent", () => {
  let component: WizardButtonsComponent;
  let fixture: ComponentFixture<WizardButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WizardButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
