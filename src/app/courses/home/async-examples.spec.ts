import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { promise } from "protractor";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {
  it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log("running assertions");
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it("Asynchronous test example - setTimeout()", fakeAsync(() => {
    let test = false;

    setTimeout(() => {});

    setTimeout(() => {
      console.log("running assertions for setTimeOut()");
      test = true;
    }, 1000);

    // tick(1000); // tick controls the passage of time in fakeAsync Zone

    flush(); // execute all the timeOuts queued by the fake Async zone before moving on in the test

    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example - plain promise", fakeAsync(() => {
    let test = false;
    console.log("Creating Promise");

    setTimeout(() => {
      console.log("running assertions for setTimeOut()1");
    });

    setTimeout(() => {
      console.log("running assertions for setTimeOut()2");
    });

    setTimeout(() => {
      console.log("running assertions for setTimeOut()3");
    });

    Promise.resolve()
      .then(() => {
        console.log("Promise1 evaluated successfully");
        test = true;

        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise2 evaluated successfully");
      });

    // only flushing the micro tasks
    flushMicrotasks();

    console.log("Running Test Assertions");

    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example - Promises + setTimeout()", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    flushMicrotasks();
    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(11);
  }));

  it("Asynchronous test example - Observables", fakeAsync(() => {
    let test = false;
    console.log("Creating Observable");

    const test$ = of(test).pipe(delay(100));

    test$.subscribe(() => {
      test = true;
    });
    tick(1000);

    console.log("Running Test Assertions");

    expect(test).toBeTruthy();
  }));
});
