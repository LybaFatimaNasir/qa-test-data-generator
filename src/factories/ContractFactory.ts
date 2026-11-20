import { faker } from '@faker-js/faker';
import { BaseFactory } from '../core/BaseFactory';

export interface Signer {
  signerId: string;
  email: string;
  role: 'PARTY_A' | 'PARTY_B' | 'WITNESS';
  signedAt: Date | null;
}

export interface Contract {
  id: string;
  title: string;
  version: number;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'OUT_FOR_SIGNATURE' | 'SIGNED' | 'EXPIRED' | 'VOIDED';
  signers: Signer[];
  documentHashSha256: string;
  effectiveDate: Date;
  clauseOverrides: string[];
}

export class ContractFactory extends BaseFactory<Contract> {
  definition(): Contract {
    return {
      id: faker.string.uuid(),
      title: `${faker.company.name()} - ${faker.helpers.arrayElement(['NDA', 'SaaS Master Agreement', 'SOW', 'Employment Contract'])}`,
      version: 1,
      status: 'DRAFT',
      signers: [
        {
          signerId: faker.string.uuid(),
          email: faker.internet.email().toLowerCase(),
          role: 'PARTY_A',
          signedAt: null
        },
        {
          signerId: faker.string.uuid(),
          email: faker.internet.email().toLowerCase(),
          role: 'PARTY_B',
          signedAt: null
        }
      ],
      documentHashSha256: faker.string.hexadecimal({ length: 64, prefix: '' }),
      effectiveDate: faker.date.soon({ days: 14 }),
      clauseOverrides: []
    };
  }
}
