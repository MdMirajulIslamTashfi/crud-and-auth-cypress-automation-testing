# CRUD-and-Auth-Web-App — Cypress e2e (Cypress 16.1.1)

## One-time setup
1. `npm install`                      (cypress 16.1.1, @cypress/grep, typescript)
2. Start the JWT server (:8081), then the app normally (no test profile, no app changes).
   Optional: point the app at a separate test database so tests don't touch dev data.

## Real-inbox OTP tests (@manual)
1. `cp .env.example .env` and fill in a real USER and a real ADMIN account (must already exist in the app).
2. `npm run test:manual` - Chrome opens, logs in, stops on the OTP page; type the emailed code and click Verify.
   The test continues by itself when the dashboard opens. Normal runs skip @manual tests.

## Notes
- Login shortcut (`cy.loginAs`) gets a token from the JWT server and sets the `jwt_token` cookie - no OTP.
- OTP is random and emailed; tests only go as far as the OTP page (LOG-H01/H02) and a wrong code (LOG-N03).

## Run
- `npm run cy:open`                                        interactive
- `npm test`                                               everything
- `npm run test:smoke | test:happy | test:negative`
- `npx cypress run --expose grepTags=@login+@negative`     one feature + one type
- `npx cypress run --expose grep=LOG-N03`                  one case by ID
- `npx cypress run --expose grepTags=-@slow --expose grepFilterSpecs=false`   exclusions

Check types / tag typos any time: `npm run typecheck`

## Conventions
- Tags live only in `cypress/support/tags.ts`. Case IDs: `<FEATURE>-<S|H|N|B><nn>` (e.g. REG-N03).
- One spec per feature, one `describe` per type, case tables via `eachCase()`.
