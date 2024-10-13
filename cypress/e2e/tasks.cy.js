/// <reference types="cypress" />

describe("Tasks tests", () => {
  it("Main", () => {
    cy.visit("http://localhost:8080");

    cy.login()

    // find by class
    cy.get(".UserDropdown").should("be.visible").click();
    cy.contains("div", "Dark").click()

    cy.wait(500);

    cy.get(".UserDropdown").should("be.visible").click();
    cy.contains("div", "Light").click();

    cy.contains("div", "Hey , Let's check your schedule for today").should("be.visible");

    // Create task
    cy.contains("button", "Create").should("be.visible").click();
    cy.get(".YodoModal").should("be.visible")
    cy.contains("label", "Task Title").should("be.visible").click();
    cy.get("input[placeholder='Try to take over the world']").type("Test task");
    cy.contains("label", "Task Description").should("be.visible").click();
    cy.get("textarea[placeholder='Somehow we will take over the world']").type("Test description");
    cy.contains("button", "Create Task").should("be.visible").click();

    // Edit task
    cy.contains("span", "Test task").should("be.visible").click();
    cy.contains("label", "Task Title").should("be.visible").click();
    cy.get("input[placeholder='Try to take over the world']").type("Test task - edit");
    cy.get(".YodoIcon.check-circle").should("be.visible");
    cy.get("body").type("{esc}");

    cy.get(".YodoIcon.trash-2").should("be.visible").click();

    cy.wait(500);
  });
});
