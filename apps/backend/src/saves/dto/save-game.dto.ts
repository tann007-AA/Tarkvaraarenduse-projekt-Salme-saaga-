import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InventoryItemDto {
  @ApiProperty({
    description: 'Inventory item identifier',
    example: 'sunstone',
    maxLength: 100,
    type: String,
  })
  itemId: string;

  @ApiPropertyOptional({
    description: 'Amount of this item in the save inventory',
    example: 1,
    minimum: 1,
    type: Number,
  })
  quantity?: number;
}

export class SaveGameDto {
  @ApiProperty({
    description: 'Save slot number for the authenticated user',
    example: 1,
    minimum: 1,
    maximum: 3,
    type: Number,
  })
  slotNumber: number;

  @ApiPropertyOptional({
    description: 'Player-facing save name',
    example: 'Before the voyage',
    maxLength: 100,
    type: String,
  })
  saveName?: string;

  @ApiPropertyOptional({
    description: 'Total play time in seconds',
    example: 1840,
    minimum: 0,
    type: Number,
  })
  playTimeSeconds?: number;

  @ApiPropertyOptional({
    description: 'Current story chapter',
    example: 1,
    minimum: 1,
    type: Number,
  })
  currentChapter?: number;

  @ApiPropertyOptional({
    description: 'Number of completed quests or story tasks',
    example: 2,
    minimum: 0,
    type: Number,
  })
  completedQuestCount?: number;

  @ApiPropertyOptional({
    description: 'Whether the player has completed ending A',
    example: false,
    type: Boolean,
  })
  completedEndingA?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the player has completed ending B',
    example: false,
    type: Boolean,
  })
  completedEndingB?: boolean;

  @ApiPropertyOptional({
    description: 'Inventory items stored with this save',
    example: [
      { itemId: 'dried-meat', quantity: 2 },
      { itemId: 'sunstone', quantity: 1 },
    ],
    type: [InventoryItemDto],
  })
  inventory?: InventoryItemDto[];
}
