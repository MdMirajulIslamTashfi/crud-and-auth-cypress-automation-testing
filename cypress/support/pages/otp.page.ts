class OtpPage {
  shouldBeOpen() {
    cy.url({ timeout: 10000 }).should('include', '/otp');
    return this;
  }
  enterCode(code: string) {
    // 6 single-digit boxes; the page's own JS joins them into the hidden field
    cy.get('.otp-box')
      .should('have.length', 6)
      .each(($box, i) => {
        cy.wrap($box).type(code[i]);
      });
    return this;
  }
  verify() {
    cy.contains('button', 'Verify Code').click();
    return this;
  }
  resend() {
    cy.contains('button', 'Resend Code').click();
    return this;
  }
  error = () => cy.get('.error');
}
export const otpPage = new OtpPage();
