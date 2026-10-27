import { UserBuilder } from '../support/builders/user.builder';
import { alert } from '../support/components/alert.component';
import { authFlow } from '../support/flows/auth.flow';
import { loginPage } from '../support/pages/login.page';
import { otpPage } from '../support/pages/otp.page';
import { eachCase, testCase } from '../support/cases';
import { TAG, tags } from '../support/tags';

describe('Login', { tags: tags(TAG.feature.login) }, () => {
  describe('Smoke', { tags: tags(TAG.type.smoke) }, () => {
    testCase('LOG-S01', 'login page shows email, password, Sign In and the Google button', () => {
      loginPage.visit();
      cy.get('#email').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.contains('button', 'Sign In').should('be.visible');
      cy.get('a[href="/oauth2/authorization/google"]').should('be.visible');
    });
  });

  describe('Happy', { tags: tags(TAG.type.happy) }, () => {
    // Valid credentials -> the app sends an OTP and opens the OTP page (we stop here: the code is random)
    eachCase(
      [
        { id: 'LOG-H01', title: 'a User with valid credentials is sent to the OTP page', role: 'USER' as const, tags: [TAG.mod.security] },
        { id: 'LOG-H02', title: 'an Admin with valid credentials is sent to the OTP page', role: 'ADMIN' as const, tags: [TAG.mod.security] },
      ],
      ({ role }) => {
        const user = new UserBuilder().with({ role }).build();   // Arrange
        cy.seedUser(user);
        authFlow.loginUntilOtpPage(user);                        // Act
        cy.location('pathname').should('eq', '/otp');            // Assert
      },
    );

    // Signed-in access (session created through the JWT server, OTP skipped)
    eachCase(
      [
        { id: 'LOG-H03', title: 'a signed-in User can open the user dashboard', role: 'USER' as const, page: '/user/dashboard' },
        { id: 'LOG-H04', title: 'a signed-in Admin can open the admin dashboard', role: 'ADMIN' as const, page: '/admin/dashboard' },
      ],
      ({ role, page }) => {
        const user = new UserBuilder().with({ role }).build();   // Arrange
        cy.seedUser(user);
        cy.loginAs(user);
        cy.visit(page);                                          // Act
        cy.location('pathname').should('eq', page);              // Assert
      },
    );
  });

  describe('Negative', { tags: tags(TAG.type.negative) }, () => {
    eachCase(
      [
        { id: 'LOG-N01', title: 'wrong password shows an error', seedFirst: true, password: 'Wrong@9999', error: 'The password you entered is incorrect' },
        { id: 'LOG-N02', title: 'unknown email shows an error', seedFirst: false, password: 'Test@1234', error: 'No account found' },
      ],
      ({ seedFirst, password, error }) => {
        const user = new UserBuilder().build();                  // Arrange
        if (seedFirst) cy.seedUser(user);
        loginPage.visit().fillCredentials(user.email, password).submit();   // Act
        cy.location('pathname').should('eq', '/login');          // Assert
        alert.error().should('contain.text', error);
      },
    );

    testCase(
      'LOG-N03',
      'a wrong code on the OTP page shows "Invalid OTP"',
      () => {
        const user = new UserBuilder().build();                  // Arrange
        cy.seedUser(user);
        authFlow.loginUntilOtpPage(user);
        otpPage.enterCode('000000').verify();                    // Act (a made-up code; a 1-in-a-million clash with the real one is accepted)
        otpPage.error().should('contain.text', 'Invalid OTP');   // Assert
      },
      [TAG.mod.security],
    );
  });
});
