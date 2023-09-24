import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftNodeTextComponent } from "./course-draft-node-text.component";

describe("CourseDraftNodeTextComponent", () => {
  let component: CourseDraftNodeTextComponent;
  let fixture: ComponentFixture<CourseDraftNodeTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftNodeTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftNodeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
