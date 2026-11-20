import {
  UserFactory,
  ContractFactory,
  DeliveryFactory,
  BankingFactory,
  EdgeCaseGenerator,
  SecurityPayloads,
  MockDatabaseAdapter,
  SeederRegistry
} from '../src';

async function runDemo() {
  console.log('=== QA Test Data Generator & Seeder Demo ===\n');

  // 1. In-memory synthetic generation
  const userFactory = new UserFactory();
  const contractFactory = new ContractFactory();
  const deliveryFactory = new DeliveryFactory();
  const bankingFactory = new BankingFactory();

  console.log('1. Generated User:');
  console.log(userFactory.build({ role: 'ADMIN', balance: 9999.5 }));

  console.log('\n2. Generated Contract (Draft):');
  console.log(contractFactory.build());

  console.log('\n3. Generated Delivery Job:');
  console.log(deliveryFactory.build({ packageType: 'FRAGILE' }));

  console.log('\n4. Generated Banking Transaction:');
  console.log(bankingFactory.build({ channel: 'SWIFT', amountCents: 1500000 }));

  // 2. Edge-cases & Security payloads
  console.log('\n5. Edge-Case Strings:');
  console.log(EdgeCaseGenerator.unicodePayloads());

  console.log('\n6. SQL Injection Payloads:');
  console.log(SecurityPayloads.sqlInjection());

  // 3. Database Seeding & Teardown
  console.log('\n7. Database Seeding & Teardown Simulation:');
  const adapter = new MockDatabaseAdapter();
  await adapter.connect();
  const seeder = new SeederRegistry(adapter);

  const seededUser = await seeder.seed('users', userFactory.build());
  console.log(`Seeded user with ID: ${seededUser.id}`);
  console.log(`Total tracked records: ${seeder.getSeededRecords().length}`);

  await seeder.cleanup();
  console.log(`Cleaned up! Total tracked records: ${seeder.getSeededRecords().length}`);
}

runDemo().catch(console.error);
