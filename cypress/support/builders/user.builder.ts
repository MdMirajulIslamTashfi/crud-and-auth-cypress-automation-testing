export interface TestUser {
  honor: string;
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'USER' | 'ADMIN';
}

// The app only accepts lowercase emails and letters-only names (ValidationUtil), so the defaults respect that.
const uniqueId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export class UserBuilder {
  private user: TestUser = {
    honor: 'Mr.',
    gender: 'Male',
    firstName: 'Test',
    lastName: 'User',
    email: `user+${uniqueId()}@example.com`,
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    role: 'USER',
  };

  with(overrides: Partial<TestUser>) {
    this.user = { ...this.user, ...overrides };
    return this;
  }
  asAdmin() {
    return this.with({ role: 'ADMIN' });
  }
  withPassword(password: string) {
    return this.with({ password, confirmPassword: password });
  }
  build(): TestUser {
    return { ...this.user };
  }
}
