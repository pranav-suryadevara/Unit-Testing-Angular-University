import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

describe("CalculatorService", () => {
  let calculator: CalculatorService, loggerSpy: any;

  beforeEach(() => {
    console.log("Calling beforeEach()");

    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);
    // logger.log.and.returnValue(); // can specify a return value using this call
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

    calculator = TestBed.get(CalculatorService);
  });

  it("should add two numbers", () => {
    // pending();
    // fail();

    console.log("add test");

    const result = calculator.add(2, 2);

    expect(result).toBe(4, "unexpected addition result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it("should add subtract numbers", () => {
    console.log("subtract test");

    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, "unexpected subtraction result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
