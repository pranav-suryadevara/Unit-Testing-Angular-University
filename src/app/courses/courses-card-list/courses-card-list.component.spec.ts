import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";
import { by } from "protractor";
import { compileNgModule } from "@angular/compiler";
import { title } from "process";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    component.courses = setupCourses();

    fixture.detectChanges();
    console.log(el.nativeElement.outerHTML);

    const cards = el.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Couldn't find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });

  it("should display the first course", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];

    const card = el.query(By.css(".course-card:first-child")),
      title = card.query(By.css("mat-card-title")),
      img = card.query(By.css("img"));

    expect(card).toBeTruthy("Couldn't find card");
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(img.nativeElement.src).toBe(course.iconUrl);
  });
});
