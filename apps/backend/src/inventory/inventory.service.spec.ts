import { BadRequestException } from '@nestjs/common';
import { InventoryService } from './inventory.service';

describe('InventoryService validation', () => {
  const createService = () => new InventoryService({} as never);

  it('rejects invalid inventory quantities before persistence is used', async () => {
    const service = createService();

    await expect(
      service.upsertItem('user-1', '1', {
        itemId: 'sunstone',
        quantity: 0,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects blank inventory item ids before persistence is used', async () => {
    const service = createService();

    await expect(
      service.replaceInventory('user-1', '1', {
        inventory: [{ itemId: ' ', quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
