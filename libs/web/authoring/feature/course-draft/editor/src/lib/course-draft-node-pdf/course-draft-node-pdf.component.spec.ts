import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftNodePdfComponent } from "./course-draft-node-pdf.component";

describe("CourseDraftNodePdfComponent", () => {
  let component: CourseDraftNodePdfComponent;
  let fixture: ComponentFixture<CourseDraftNodePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftNodePdfComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftNodePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
