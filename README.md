# QA Test Data Generator & Database Seeder

A modular, extensible synthetic test data generator and transactional database seeder utility designed for QA automation engineers.

## Features
- **Schema-compliant Synthetic Data**: Built on top of `@faker-js/faker` with typed Builder / Factory patterns.
- **Security & Edge-Case Payloads**: Out-of-the-box SQL injection, XSS vectors, Zalgo text, RTL, Unicode surrogates, and boundary limits.
- **Database Seeding & Teardown**: Pluggable database adapters (PostgreSQL, MongoDB, and in-memory mock) with tracked reverse-order cleanup (LIFO).
- **Test Runner Integration**: Zero-boilerplate fixtures for Playwright, Jest, and Pytest.
- **Domain Blueprints Included**: Ready-to-use models for Contracts/Legal, Delivery/Logistics, and Core Banking/FinTech.

## Quick Start

```bash
npm install
npm run build
```

## Usage Example

```typescript
import { UserFactory, MockDatabaseAdapter, SeederRegistry } from './src';

// 1. In-memory data generation
const userFactory = new UserFactory();
const user = userFactory.build({ balance: 1500 });

// 2. Database seeding with automatic teardown
const adapter = new MockDatabaseAdapter();
const seeder = new SeederRegistry(adapter);

await seeder.seed('users', user);
// ... run tests ...
await seeder.cleanup(); // cleans up all seeded records
```
