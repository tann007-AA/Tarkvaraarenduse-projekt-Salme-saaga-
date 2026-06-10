import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertInventoryItemDto {
  @ApiProperty({
    description: 'Inventory item identifier',
    example: 'kodumulla-paun',
    maxLength: 100,
    type: String,
  })
  itemId: string;

  @ApiPropertyOptional({
    description: 'Amount to store for this item',
    example: 1,
    minimum: 1,
    type: Number,
  })
  quantity?: number;
}
