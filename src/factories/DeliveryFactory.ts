import { faker } from '@faker-js/faker';
import { BaseFactory } from '../core/BaseFactory';

export interface LocationCoordinate {
  lat: number;
  lng: number;
  address: string;
}

export interface DeliveryJob {
  id: string;
  customerId: string;
  courierId: string | null;
  pickupLocation: LocationCoordinate;
  dropoffLocation: LocationCoordinate;
  packageType: 'DOCUMENTS' | 'PERISHABLE' | 'FRAGILE' | 'OVERSIZED';
  status: 'SEARCHING_DRIVER' | 'DRIVER_ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  distanceKm: number;
  deliveryFee: number;
  tipAmount: number;
}

export class DeliveryFactory extends BaseFactory<DeliveryJob> {
  definition(): DeliveryJob {
    const distanceKm = faker.number.float({ min: 1.2, max: 25.0, fractionDigits: 1 });
    const deliveryFee = parseFloat((5.0 + distanceKm * 1.5).toFixed(2));

    return {
      id: faker.string.uuid(),
      customerId: faker.string.uuid(),
      courierId: null,
      pickupLocation: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        address: faker.location.streetAddress()
      },
      dropoffLocation: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        address: faker.location.streetAddress()
      },
      packageType: faker.helpers.arrayElement(['DOCUMENTS', 'PERISHABLE', 'FRAGILE', 'OVERSIZED']),
      status: 'SEARCHING_DRIVER',
      distanceKm,
      deliveryFee,
      tipAmount: parseFloat(faker.finance.amount({ min: 0, max: 15, dec: 2 }))
    };
  }
}
