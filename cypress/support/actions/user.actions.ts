import { TestUser } from '../builders/user.builder';
import { authFlow } from '../flows/auth.flow';

// App Actions = fast shortcuts that skip the UI. Use them for ARRANGE, never for the thing under test.

/** Creates a user by POSTing the register form directly (CSRF is off in this app). */
export function seedUser(u: TestUser) {
  return cy
    .request({
      method: 'POST',
      url: '/register',
      form: true,
      followRedirect: false,
      body: {
        honor: u.honor,
        gender: u.gender,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: u.password,
        confirmPassword: u.confirmPassword,
        role: u.role,
      },
    })
    .then((res) => {
      // success = redirect to /login?registered=true; failure re-renders the form with 200
      expect(res.status, `seeding ${u.email}`).to.eq(302);
      expect(res.redirectedToUrl).to.contain('registered=true');
    });
}

/** Logs in once per user (UI + OTP) and caches the session cookie. */
export function loginAs(u: TestUser) {
  cy.session(
    ['login', u.email],
    () => {
      authFlow.loginWithOtpViaUi(u);
      cy.url().should('match', /\/(user|admin)\/dashboard/);
    },
    { validate: () => { cy.getCookie('jwt_token').should('exist'); } },
  );
}
