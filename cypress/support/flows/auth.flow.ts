import { TestUser } from '../builders/user.builder';
import { loginPage } from '../pages/login.page';
import { otpPage } from '../pages/otp.page';
import { registerPage } from '../pages/register.page';
import { readOtp } from '../actions/mailpit';

// Flows = business steps through the UI. (Screenplay will replace these later.)
export const authFlow = {
  registerViaUi(user: TestUser) {
    registerPage.visit().fillForm(user).submit();
  },

  /** Login form -> email OTP (read from Mailpit) -> dashboard */
  loginWithOtpViaUi(user: TestUser) {
    loginPage.visit().fillCredentials(user.email, user.password).submit();
    cy.url().should('include', '/otp');
    readOtp(user.email).then((code) => otpPage.enterCode(code).verify());
  },
};
