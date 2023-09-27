import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseDraftNodeEditComponent } from "./course-draft-node-edit.component";

describe("CourseDraftNodeEditComponent", () => {
  let component: CourseDraftNodeEditComponent;
  let fixture: ComponentFixture<CourseDraftNodeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftNodeEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDraftNodeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
