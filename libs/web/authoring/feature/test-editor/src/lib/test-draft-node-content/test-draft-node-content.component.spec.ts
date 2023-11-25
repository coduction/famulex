import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestDraftNodeContentComponent } from "./test-draft-node-content.component";

describe("TestDraftNodeContentComponent", () => {
  let component: TestDraftNodeContentComponent;
  let fixture: ComponentFixture<TestDraftNodeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDraftNodeContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDraftNodeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
