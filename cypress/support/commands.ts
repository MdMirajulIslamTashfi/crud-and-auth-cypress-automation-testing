import { clearMailbox } from './actions/mailpit';
import { loginAs, seedUser } from './actions/user.actions';
import { TestUser } from './builders/user.builder';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      seedUser(user: TestUser): Chainable<void>;
      loginAs(user: TestUser): Chainable<void>;
      clearMailbox(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('seedUser', (user) => { seedUser(user); });
Cypress.Commands.add('loginAs', (user) => { loginAs(user); });
Cypress.Commands.add('clearMailbox', () => { clearMailbox(); });
