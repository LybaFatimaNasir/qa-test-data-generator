import { faker } from '@faker-js/faker';
import { BaseFactory } from '../core/BaseFactory';

export interface LedgerTransaction {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amountCents: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  channel: 'SWIFT' | 'SEPA' | 'ACH' | 'INTERNAL';
  status: 'PENDING' | 'CLEARED' | 'REJECTED' | 'REVERSED';
  riskScore: number;
  idempotencyKey: string;
  createdAt: Date;
}

export class BankingFactory extends BaseFactory<LedgerTransaction> {
  definition(): LedgerTransaction {
    return {
      id: faker.string.uuid(),
      sourceAccountId: `acc_${faker.string.alphanumeric({ length: 12, casing: 'upper' })}`,
      destinationAccountId: `acc_${faker.string.alphanumeric({ length: 12, casing: 'upper' })}`,
      amountCents: faker.number.int({ min: 100, max: 500000 }), // $1.00 to $5000.00
      currency: 'USD',
      channel: 'INTERNAL',
      status: 'PENDING',
      riskScore: faker.number.float({ min: 0.01, max: 0.25, fractionDigits: 2 }),
      idempotencyKey: faker.string.uuid(),
      createdAt: new Date()
    };
  }
}
