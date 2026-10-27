import { UserBuilder, TestUser } from '../support/builders/user.builder';
import { alert } from '../support/components/alert.component';
import { authFlow } from '../support/flows/auth.flow';
import { registerPage } from '../support/pages/register.page';
import { eachCase, testCase } from '../support/cases';
import { TAG, tags } from '../support/tags';

describe('Register', { tags: tags(TAG.feature.register) }, () => {
  describe('Smoke', { tags: tags(TAG.type.smoke) }, () => {
    testCase('REG-S01', 'register page shows every field and the Create Account button', () => {
      registerPage.visit();
      registerPage.fields().forEach((selector) => cy.get(selector).should('be.visible'));
      cy.contains('button', 'Create Account').should('be.visible');
    });
  });

  describe('Happy', { tags: tags(TAG.type.happy) }, () => {
    eachCase(
      [
        { id: 'REG-H01', title: 'a new User registers and is sent to Sign In with a success message', role: 'USER' as const },
        { id: 'REG-H02', title: 'a new Admin registers and is sent to Sign In with a success message', role: 'ADMIN' as const },
      ],
      ({ role }) => {
        const user = new UserBuilder().with({ role }).build();   // Arrange
        authFlow.registerViaUi(user);                            // Act
        cy.location('pathname').should('eq', '/login');          // Assert
        alert.success().should('contain.text', 'Registration successful');
      },
    );
  });

  describe('Negative', { tags: tags(TAG.type.negative) }, () => {
    interface Row {
      id: string;
      title: string;
      fields: Partial<TestUser>;
      error: string;
      seedFirst?: boolean;
    }
    const rows: Row[] = [
      { id: 'REG-N01', title: 'rejects a first name with digits', fields: { firstName: 'J0hn' }, error: 'Name format is invalid' },
      { id: 'REG-N02', title: 'rejects a last name with symbols', fields: { lastName: 'Doe!' }, error: 'Name format is invalid' },
      { id: 'REG-N03', title: 'rejects an email with uppercase letters', fields: { email: 'USER@EXAMPLE.COM' }, error: 'Email format is invalid' },
      { id: 'REG-N04', title: 'rejects an email that is already registered', fields: {}, error: 'Email already registered', seedFirst: true },
    ];

    eachCase(rows, ({ fields, error, seedFirst }) => {
      const user = new UserBuilder().with(fields).build();       // Arrange
      if (seedFirst) cy.seedUser(user);
      authFlow.registerViaUi(user);                              // Act
      cy.location('pathname').should('eq', '/register');         // Assert: stays on the form
      alert.error().should('contain.text', error);
    });
  });
});
