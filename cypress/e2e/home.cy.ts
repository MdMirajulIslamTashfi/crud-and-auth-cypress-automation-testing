import { homePage } from '../support/pages/home.page';
import { eachCase, testCase } from '../support/cases';
import { TAG, tags } from '../support/tags';

describe('Home page', { tags: tags(TAG.feature.home) }, () => {
  describe('Smoke', { tags: tags(TAG.type.smoke) }, () => {
    testCase('HOME-S01', 'home page loads and shows the title and the Sign In / Sign Up links', () => {
      // Arrange + Act
      homePage.visit();
      // Assert
      cy.title().should('eq', 'UserSystem');
      homePage.heroTitle().should('be.visible');
      homePage.signInLink().should('be.visible');
      homePage.signUpLink().should('be.visible');
    });
  });

  describe('Happy', { tags: tags(TAG.type.happy) }, () => {
    eachCase(
      [
        { id: 'HOME-H01', title: 'Sign In link opens the login page', open: () => homePage.signInLink().click(), path: '/login' },
        { id: 'HOME-H02', title: 'Sign Up link opens the register page', open: () => homePage.signUpLink().click(), path: '/register' },
        { id: 'HOME-H03', title: 'Get Started button opens the register page', open: () => homePage.getStartedButton().click(), path: '/register' },
      ],
      ({ open, path }) => {
        homePage.visit();                                   // Arrange
        open();                                             // Act
        cy.location('pathname').should('eq', path);         // Assert
      },
    );
  });
});
