import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WizardWrapperComponent }    from "./wizard-wrapper.component";

describe("WizardComponent", () => {
  let component: WizardWrapperComponent;
  let fixture: ComponentFixture<WizardWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardWrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WizardWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
