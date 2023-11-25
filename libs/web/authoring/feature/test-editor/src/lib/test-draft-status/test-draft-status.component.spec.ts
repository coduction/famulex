import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestDraftStatusComponent } from "./test-draft-status.component";

describe("TestDraftStatusComponent", () => {
  let component: TestDraftStatusComponent;
  let fixture: ComponentFixture<TestDraftStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDraftStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDraftStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
