import { UserBuilder } from '../support/builders/user.builder';
import { alert } from '../support/components/alert.component';
import { readOtp } from '../support/actions/mailpit';
import { authFlow } from '../support/flows/auth.flow';
import { loginPage } from '../support/pages/login.page';
import { otpPage } from '../support/pages/otp.page';
import { eachCase, testCase } from '../support/cases';
import { TAG, tags } from '../support/tags';

describe('Login', { tags: tags(TAG.feature.login) }, () => {
  before(() => cy.clearMailbox()); // keeps Mailpit tidy; tests never depend on it (OTPs are looked up by recipient)

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
    eachCase(
      [
        { id: 'LOG-H01', title: 'a User signs in with the emailed code and reaches the user dashboard', role: 'USER' as const, landing: '/user/dashboard', tags: [TAG.mod.security] },
        { id: 'LOG-H02', title: 'an Admin signs in with the emailed code and reaches the admin dashboard', role: 'ADMIN' as const, landing: '/admin/dashboard', tags: [TAG.mod.security] },
      ],
      ({ role, landing }) => {
        const user = new UserBuilder().with({ role }).build();   // Arrange
        cy.seedUser(user);                                       // (App Action - fast, no UI)
        authFlow.loginWithOtpViaUi(user);                        // Act
        cy.location('pathname').should('eq', landing);           // Assert
        cy.getCookie('jwt_token').should('exist');
      },
    );
  });

  describe('Negative', { tags: tags(TAG.type.negative) }, () => {
    eachCase(
      [
        { id: 'LOG-N01', title: 'wrong password shows an error', seedFirst: true, password: 'Wrong@9999', error: 'Incorrect password' },
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
        loginPage.visit().fillCredentials(user.email, user.password).submit();
        cy.url().should('include', '/otp');
        readOtp(user.email).then((real) => {
          const wrong = real === '000000' ? '111111' : '000000';
          otpPage.enterCode(wrong).verify();                     // Act
        });
        otpPage.error().should('contain.text', 'Invalid OTP');   // Assert
      },
      [TAG.mod.security],
    );
  });
});
