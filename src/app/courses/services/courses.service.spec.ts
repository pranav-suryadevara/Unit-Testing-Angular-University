import { HttpErrorResponse } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { camelCase } from "cypress/types/jquery";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { saveCourse } from "../../../../server/save-course.route";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

describe("CoursesService", () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No Courses Returned");
      expect(courses.length).toBe(12, "incorrect number of courses");

      const course = courses.find((course) => course.id === 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });

    // specifying how the findAllCourses() method is returning test data
    const req = httpTestingController.expectOne("/api/courses");

    expect(req.request.method).toEqual("GET");

    req.flush({ payload: Object.values(COURSES) }); // flush method is used to pass data
  });

  it("should find course by an indentifier", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy("No Course Returned");

      expect(course.id).toBe(12);
    });

    // specifying how the findAllCourses() method is returning test data
    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("GET");

    req.flush(COURSES[12]); // flush method is used to pass data
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course For Angular" },
    };
    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    // specifying how the findAllCourses() method is returning test data
    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );

    req.flush({ ...COURSES[12], ...changes }); // flush method is used to pass data
    // changes overrides some of the properties in the courses[12]
  });

  it("should give an error if save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course For Angular" },
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail("the save course operation should have failed"),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    req.flush("Save Course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("should find a list of lessons", () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (req) => req.url == "/api/lessons"
    );

    expect(req.request.method).toEqual("GET");

    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  afterEach(() => {
    // making sure no other http request are made
    httpTestingController.verify();
  });
});
