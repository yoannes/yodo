/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import dayjs from "dayjs";
import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";



Cypress.dayjs = dayjs;

Cypress.Commands.add("login", () => {
  const firebaseConfig = Cypress.env("VITE_FIREBASE") || "{}";
  const app = initializeApp(JSON.parse(firebaseConfig));
  const auth = getAuth(app);
  const db = getFirestore(app);

  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8090);

  createUserWithEmailAndPassword(auth, "test@yodo.com", "asd12345").catch(() => {
    signInWithEmailAndPassword(auth, "test@yodo.com", "asd12345");
  });
});

Cypress.Commands.add("logout", () => {
  const firebaseConfig = Cypress.env("VITE_FIREBASE") || "{}";
  const app = initializeApp(JSON.parse(firebaseConfig));
  const auth = getAuth(app);
  const db = getFirestore(app);

  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8090);

  signOut(auth)
});
