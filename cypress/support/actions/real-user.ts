import { TestUser } from '../builders/user.builder';

export type RealUser = Pick<TestUser, 'email' | 'password' | 'role'>;

/** Credentials of a real, already-registered account, read from .env by a Node task (never hard-coded). */
export function realUser(role: RealUser['role']): Cypress.Chainable<RealUser> {
  return cy
    .task<{ email: string; password: string }>('realCredentials', role)
    .then((credentials) => ({ ...credentials, role }));
}
