import { ComponentFixture, TestBed }    from "@angular/core/testing";
import { RouterTestingModule }          from "@angular/router/testing";
import { AdministrationShellComponent } from "@famulex/web/administration/feature/shell";

describe("WebAdministrationShellComponent", () => {
  let component: AdministrationShellComponent;
  let fixture: ComponentFixture<AdministrationShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrationShellComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrationShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
