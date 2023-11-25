import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestDraftContentComponent } from "./test-draft-content.component";

describe("TestDraftContentComponent", () => {
  let component: TestDraftContentComponent;
  let fixture: ComponentFixture<TestDraftContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDraftContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDraftContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
