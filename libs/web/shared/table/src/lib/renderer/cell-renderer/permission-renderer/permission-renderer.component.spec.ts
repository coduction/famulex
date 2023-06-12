import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PermissionRendererComponent } from "./permission-renderer.component";

describe("PermissionRendererComponent", () => {
  let component: PermissionRendererComponent;
  let fixture: ComponentFixture<PermissionRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
