/// <reference types="cypress" />

describe("Auth tests", () => {
  it("Login", () => {
    cy.visit("http://localhost:8080/login");

    cy.logout()

    cy.contains("div", "Let's start 🚀").should("be.visible");
    cy.contains("div", "Signup or login into your account here").should("be.visible");
    cy.contains("div", "Continue with Google").should("be.visible");
  });
});
