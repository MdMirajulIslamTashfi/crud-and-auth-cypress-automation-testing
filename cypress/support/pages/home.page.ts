class HomePage {
  visit() {
    cy.visit('/index');
    return this;
  }
  heroTitle = () => cy.get('.hero-title');
  // the nav bar and the hero both have these links; .first() = the nav one
  signInLink = () => cy.get('a[href="/login"]').first();
  signUpLink = () => cy.get('a[href="/register"]').first();
  getStartedButton = () => cy.contains('a', 'Get Started');
}
export const homePage = new HomePage();
