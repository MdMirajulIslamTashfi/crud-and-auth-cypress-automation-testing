import { TestUser } from '../builders/user.builder';
import { loginPage } from '../pages/login.page';
import { otpPage } from '../pages/otp.page';
import { registerPage } from '../pages/register.page';

// Flows = business steps through the UI. (Screenplay will replace these later.)
export const authFlow = {
  registerViaUi(user: TestUser) {
    registerPage.visit().fillForm(user).submit();
  },

  /** Login form with valid credentials -> the app sends an OTP and opens the OTP page. */
  loginUntilOtpPage(user: Pick<TestUser, 'email' | 'password'>) {
    loginPage.visit().fillCredentials(user.email, user.password).submit();
    otpPage.shouldBeOpen();
  },

  /**
   * Real inbox: submit the credentials, then WAIT while a human reads the emailed OTP, types it in the
   * browser and clicks Verify. Continues by itself once the role dashboard opens. The code expires after 60s.
   */
  loginWithManualOtp(user: Pick<TestUser, 'email' | 'password'>, waitMs = 120_000) {
    loginPage.visit().fillCredentials(user.email, user.password).submit();
    otpPage.shouldBeOpen();
    cy.log('**>>> Check your email, type the OTP in the browser and click Verify (code expires in 60s; use Resend Code if needed)**');
    cy.location('pathname', { timeout: waitMs }).should('match', /^\/(user|admin)\/dashboard$/);
  },
};
