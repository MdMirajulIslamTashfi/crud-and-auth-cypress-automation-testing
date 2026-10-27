import { defineConfig } from 'cypress';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';

// Real-inbox credentials live in .env (git-ignored). See .env.example
try {
  process.loadEnvFile('.env');
} catch {
  /* no .env file: fine unless you run the @manual tests */
}

export default defineConfig({
  // @manual tests (a human types the OTP) are skipped by default; run them with: npm run test:manual
  expose: { grepTags: '-@manual', grepFilterSpecs: false },
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      cypressGrepPlugin(config);

      on('task', {
        realCredentials(role: 'USER' | 'ADMIN') {
          const prefix = role === 'ADMIN' ? 'REAL_ADMIN' : 'REAL_USER';
          const email = process.env[`${prefix}_EMAIL`];
          const password = process.env[`${prefix}_PASSWORD`];
          if (!email || !password) {
            throw new Error(`Set ${prefix}_EMAIL and ${prefix}_PASSWORD in .env (see .env.example)`);
          }
          return { email, password };
        },
      });

      return config;
    },
  },
});
