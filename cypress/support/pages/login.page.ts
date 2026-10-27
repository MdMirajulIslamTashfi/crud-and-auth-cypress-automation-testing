class LoginPage {
  visit() {
    cy.visit('/login');
    return this;
  }
  fillCredentials(email: string, password: string) {
    cy.get('#email').type(email);
    cy.get('#password').type(password, { log: false });
    return this;
  }
  submit() {
    cy.contains('button', 'Sign In').click();
    return this;
  }
}
export const loginPage = new LoginPage();
