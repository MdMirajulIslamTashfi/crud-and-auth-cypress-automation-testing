import { TestUser } from "../builders/user.builder";
import { JWT_SERVER_URL } from "../config";

// App Actions = fast shortcuts that skip the UI. Use them for ARRANGE, never for the thing under test.

/** Creates a user by POSTing the register form directly (CSRF is off in this app). */
export function seedUser(u: TestUser) {
  return cy
    .request({
      method: "POST",
      url: "/register",
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
      expect(res.redirectedToUrl).to.contain("registered=true");
    });
}

/**
 * Logs in WITHOUT the OTP step: asks the JWT server for a token (exactly what the app does after a
 * correct OTP) and sets it as the `jwt_token` cookie. The user must already exist (seedUser).
 */
export function loginAs(u: TestUser) {
  cy.session(
    ["jwt", u.email],
    () => {
      cy.request<{ token: string }>({
        method: "POST",
        url: `${JWT_SERVER_URL}/api/jwt/generate`,
        body: { email: u.email, password: u.password, role: u.role },
      }).then(({ body }) => {
        cy.setCookie("jwt_token", body.token, {
          domain: "localhost",
          path: "/",
          httpOnly: true,
        });
      });
    },
    {
      validate: () => {
        cy.getCookie("jwt_token").should("exist");
      },
    },
  );
}
