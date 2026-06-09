import { BadRequestException } from '@nestjs/common';
import { SavesService } from './saves.service';

describe('SavesService validation', () => {
  const createService = () => new SavesService({} as never);

  it('rejects save slots outside the allowed range before persistence is used', async () => {
    const service = createService();

    await expect(
      service.saveGame('user-1', {
        slotNumber: 4,
        saveName: 'Invalid slot',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects invalid inventory quantities before persistence is used', async () => {
    const service = createService();

    await expect(
      service.saveGame('user-1', {
        slotNumber: 1,
        inventory: [{ itemId: 'sunstone', quantity: 0 }],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
