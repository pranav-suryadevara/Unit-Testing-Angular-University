describe("Home Page", () => {
  beforeEach(() => {
    cy.fixture("courses.json").as("coursesJSON"); // loading the data to a variable

    cy.server(); // starting a mock backend server

    // linking the data to a http request and naming the routing event that will occur
    cy.route("/api/courses", "@coursesJSON").as("coursesDisplayEvent");

    cy.visit("/");
  });

  it("should display a list of courses", () => {
    cy.contains("All Courses");

    // waiting for the request to be completed
    cy.wait("@coursesDisplayEvent");

    cy.get("mat-card").should("have.length", 9);
  });

  it("should display the advanced courses", () => {
    cy.wait("@coursesDisplayEvent");

    cy.get(".mdc-tab").should("have.length", 2);

    cy.get(".mdc-tab").last().click();

    cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title")
      .its("length")
      .should("be.gt", 1);

    cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title")
      .first()
      .should("contain", "Angular Security Course");
  });
});
