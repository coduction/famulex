import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CellRendererWrapperComponent } from "./cell-renderer-wrapper.component";

describe("CellRendererWrapperComponent", () => {
  let component: CellRendererWrapperComponent;
  let fixture: ComponentFixture<CellRendererWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellRendererWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CellRendererWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
