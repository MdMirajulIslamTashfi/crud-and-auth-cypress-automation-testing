class UserDashboardPage {
  /**
   * Waits until the page has really rendered (not just until the URL changed).
   * The weather lookup can be slow, so give the page plenty of time.
   */
  shouldBeLoadedFor(email: string) {
    cy.location('pathname').should('eq', '/user/dashboard');
    cy.title({ timeout: 30000 }).should('eq', 'Dashboard — UserSystem');
    cy.get('.greeting-role', { timeout: 30000 }).should('contain.text', 'USER');
    cy.contains('.field-val', email).should('be.visible');   // profile card shows the signed-in email
    cy.get('.weather-card').should('be.visible');            // card is there even if the weather service is down
    return this;
  }
}
export const userDashboardPage = new UserDashboardPage();
