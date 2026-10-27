// Component object: the banner shown on register/login (and similar pages).
export const alert = {
  error: () => cy.get('.alert-error'),
  success: () => cy.get('.alert-success'),
  info: () => cy.get('.alert-info'),
};
