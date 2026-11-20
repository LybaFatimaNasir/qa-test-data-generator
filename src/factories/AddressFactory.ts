import { faker } from '@faker-js/faker';
import { BaseFactory } from '../core/BaseFactory';

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export class AddressFactory extends BaseFactory<Address> {
  definition(): Address {
    return {
      id: faker.string.uuid(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country()
    };
  }
}
