import { ApiProperty } from '@nestjs/swagger';
import { UpsertInventoryItemDto } from './upsert-inventory-item.dto';

export class ReplaceInventoryDto {
  @ApiProperty({
    description: 'Full inventory state to store for this save slot',
    example: [
      { itemId: 'dried-meat', quantity: 2 },
      { itemId: 'sunstone', quantity: 1 },
      { itemId: 'kodumulla-paun', quantity: 1 },
    ],
    type: [UpsertInventoryItemDto],
  })
  inventory: UpsertInventoryItemDto[];
}
