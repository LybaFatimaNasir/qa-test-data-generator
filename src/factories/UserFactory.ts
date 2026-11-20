import { faker } from '@faker-js/faker';
import { BaseFactory } from '../core/BaseFactory';
import { Address, AddressFactory } from './AddressFactory';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'CUSTOMER' | 'SUPPORT';
  address: Address;
  balance: number;
  isActive: boolean;
  createdAt: Date;
}

export class UserFactory extends BaseFactory<User> {
  private addressFactory = new AddressFactory();

  definition(): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email().toLowerCase(),
      fullName: faker.person.fullName(),
      role: 'CUSTOMER',
      address: this.addressFactory.build(),
      balance: parseFloat(faker.finance.amount({ min: 10, max: 5000, dec: 2 })),
      isActive: true,
      createdAt: faker.date.recent({ days: 30 })
    };
  }
}
