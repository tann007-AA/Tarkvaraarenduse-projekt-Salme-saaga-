import { ApiProperty } from '@nestjs/swagger';

export class InventoryItemDto {
  @ApiProperty({
    description: 'Inventory item identifier',
    example: 'sunstone',
    maxLength: 100,
    type: String,
  })
  itemId: string;

  @ApiProperty({
    description: 'Amount of this item in the inventory',
    example: 1,
    minimum: 1,
    type: Number,
  })
  quantity: number;
}

export class InventoryResponseDto {
  @ApiProperty({
    description: 'Save slot number',
    example: 1,
    type: Number,
  })
  slotNumber: number;

  @ApiProperty({
    description: 'Inventory items for the save slot',
    example: [
      { itemId: 'dried-meat', quantity: 2 },
      { itemId: 'sunstone', quantity: 1 },
    ],
    type: [InventoryItemDto],
  })
  inventory: InventoryItemDto[];
}

export class InventoryMessageResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Inventory item removed.',
    type: String,
  })
  message: string;
}
