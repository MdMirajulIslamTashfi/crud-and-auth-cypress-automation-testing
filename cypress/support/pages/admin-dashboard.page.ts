class AdminDashboardPage {
  shouldBeLoadedFor(email: string) {
    cy.location('pathname').should('eq', '/admin/dashboard');
    cy.title({ timeout: 30000 }).should('eq', 'Admin Dashboard — UserSystem');
    cy.get('.page-title', { timeout: 30000 }).should('contain.text', 'User Management');
    cy.contains('strong', email).should('be.visible');       // "Signed in as <email>"
    cy.get('.stats .stat').should('have.length', 3);         // Selected Users / Admins / Total Users
    cy.get('input[name="q"][type="text"]').should('be.visible'); // search box
    return this;
  }
}
export const adminDashboardPage = new AdminDashboardPage();
