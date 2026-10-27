import { TestUser } from '../builders/user.builder';

class RegisterPage {
  visit() {
    cy.visit('/register');
    return this;
  }
  fillForm(u: TestUser) {
    cy.get('#honor').select(u.honor);
    cy.get('#gender').select(u.gender);
    cy.get('#firstName').type(u.firstName);
    cy.get('#lastName').type(u.lastName);
    cy.get('#email').type(u.email);
    cy.get('#password').type(u.password, { log: false });
    cy.get('#confirmPassword').type(u.confirmPassword, { log: false });
    cy.get('#role').select(u.role);
    return this;
  }
  submit() {
    cy.contains('button', 'Create Account').click();
    return this;
  }
  fields = () => ['#honor', '#gender', '#firstName', '#lastName', '#email', '#password', '#confirmPassword', '#role'];
  title = () => cy.get('.card-title');
}
export const registerPage = new RegisterPage();
