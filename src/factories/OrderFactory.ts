import { faker } from '@faker-js/faker';
import { BaseFactory } from '../core/BaseFactory';

export interface OrderItem {
  itemId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
  placedAt: Date;
}

export class OrderFactory extends BaseFactory<Order> {
  definition(): Order {
    const items: OrderItem[] = Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => {
      const unitPrice = parseFloat(faker.commerce.price({ min: 5, max: 150, dec: 2 }));
      const quantity = faker.number.int({ min: 1, max: 3 });
      return {
        itemId: faker.string.uuid(),
        sku: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
        name: faker.commerce.productName(),
        quantity,
        unitPrice
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      items,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: 'PENDING',
      placedAt: faker.date.recent({ days: 7 })
    };
  }
}
