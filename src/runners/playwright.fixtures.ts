import { UserFactory, User } from '../factories/UserFactory';
import { SeederRegistry } from '../core/SeederRegistry';
import { MockDatabaseAdapter } from '../adapters/MockDatabaseAdapter';

// Types for custom Playwright test fixtures
export interface QAFixtures {
  seeder: SeederRegistry;
  testUser: User;
}

/**
 * Playwright fixture definition helper.
 * Usage:
 *   import { test as baseTest } from '@playwright/test';
 *   import { createPlaywrightFixtures } from './playwright.fixtures';
 *   export const test = baseTest.extend(createPlaywrightFixtures(adapter));
 */
export function createPlaywrightFixtures(adapter = new MockDatabaseAdapter()) {
  return {
    seeder: async ({}, use: (s: SeederRegistry) => Promise<void>) => {
      await adapter.connect();
      const seeder = new SeederRegistry(adapter);
      await use(seeder);
      await seeder.cleanup();
      await adapter.disconnect();
    },
    testUser: async ({ seeder }: { seeder: SeederRegistry }, use: (u: User) => Promise<void>) => {
      const user = new UserFactory().build();
      const seeded = await seeder.seed('users', user);
      await use(seeded);
    }
  };
}
