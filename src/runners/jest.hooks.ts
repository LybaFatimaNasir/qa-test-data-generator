import { DatabaseAdapter } from '../adapters/DatabaseAdapter';
import { SeederRegistry } from '../core/SeederRegistry';

export function setupJestHooks(adapter: DatabaseAdapter) {
  let seeder: SeederRegistry;

  beforeAll(async () => {
    await adapter.connect();
  });

  afterAll(async () => {
    await adapter.disconnect();
  });

  beforeEach(() => {
    seeder = new SeederRegistry(adapter);
  });

  afterEach(async () => {
    if (seeder) {
      await seeder.cleanup();
    }
  });

  return () => seeder;
}
