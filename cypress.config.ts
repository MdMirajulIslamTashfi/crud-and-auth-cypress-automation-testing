import { defineConfig } from 'cypress';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';

export default defineConfig({
  // Skip spec files that contain no matching tests (big win once there are many features).
  // NOTE: inverted filters like -@slow are not compatible with this -> pass --expose grepFilterSpecs=false.
  expose: { grepFilterSpecs: true },
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      cypressGrepPlugin(config);
      return config;
    },
  },
});
