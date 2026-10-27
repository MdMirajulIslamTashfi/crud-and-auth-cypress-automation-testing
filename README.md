# CRUD-and-Auth-Web-App — Cypress e2e (Cypress 16.1.1)

## One-time setup
1. `npm install`                      (cypress 16.1.1, @cypress/grep, typescript)
2. `npm run mail:up`                  (Mailpit: SMTP :1025, UI/API :8025 — needs Docker)
3. Copy `infra/application-test.properties` into the app's `src/main/resources/`
4. Start the JWT server (:8081), then the app:
   `./gradlew bootRun --args='--spring.profiles.active=test'`

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
