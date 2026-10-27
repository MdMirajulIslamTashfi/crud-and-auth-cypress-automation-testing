import { MAILPIT_URL } from '../config';

interface MailpitSearchResult {
  messages: { Subject: string }[];
}

export function clearMailbox() {
  return cy.request('DELETE', `${MAILPIT_URL}/api/v1/messages`);
}

/**
 * Reads the newest OTP sent TO this address (the app puts it in the subject: "OTP Code: 123456").
 * Filters by recipient, so parallel/earlier tests with other emails can never leak in.
 * Polls because the mail may arrive a moment after the redirect.
 */
export function readOtp(email: string, attempts = 10): Cypress.Chainable<string> {
  return cy
    .request<MailpitSearchResult>({
      url: `${MAILPIT_URL}/api/v1/search`,
      qs: { query: `to:"${email}"` },
    })
    .then(({ body }) => {
      const match = body.messages?.[0]?.Subject?.match(/OTP Code: (\d{6})/);
      if (match) return cy.wrap(match[1]) as Cypress.Chainable<string>;
      if (attempts <= 1) throw new Error(`No OTP email arrived for ${email}`);
      cy.wait(500);
      return readOtp(email, attempts - 1);
    });
}
