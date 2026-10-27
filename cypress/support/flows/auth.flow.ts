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
  loginUntilOtpPage(user: TestUser) {
    loginPage.visit().fillCredentials(user.email, user.password).submit();
    otpPage.shouldBeOpen();
  },
};
