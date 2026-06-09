import { ApiProperty } from '@nestjs/swagger';
import { InventoryItemDto } from './save-game.dto';

export class SaveProgressDto {
  @ApiProperty({
    description: 'Current story chapter',
    example: 1,
    type: Number,
  })
  currentChapter: number;

  @ApiProperty({
    description: 'Number of completed quests or story tasks',
    example: 2,
    type: Number,
  })
  completedQuestCount: number;

  @ApiProperty({
    description: 'Whether the player has completed ending A',
    example: false,
    type: Boolean,
  })
  completedEndingA: boolean;

  @ApiProperty({
    description: 'Whether the player has completed ending B',
    example: false,
    type: Boolean,
  })
  completedEndingB: boolean;
}

export class SaveResponseDto {
  @ApiProperty({
    description: 'Save identifier',
    example: 'b2c3f613-4128-4e3e-83bf-9d346b413f8e',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Save slot number',
    example: 1,
    type: Number,
  })
  slotNumber: number;

  @ApiProperty({
    description: 'Player-facing save name',
    example: 'Before the voyage',
    nullable: true,
    type: String,
  })
  saveName: string | null;

  @ApiProperty({
    description: 'Total play time in seconds',
    example: 1840,
    type: Number,
  })
  playTimeSeconds: number;

  @ApiProperty({
    description: 'Last time this save was played or written',
    example: '2026-06-09T10:45:00.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  lastPlayedAt: string | null;

  @ApiProperty({
    description: 'Save creation timestamp',
    example: '2026-06-09T10:30:00.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  createdAt: string | null;

  @ApiProperty({
    description: 'Save update timestamp',
    example: '2026-06-09T10:45:00.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  updatedAt: string | null;

  @ApiProperty({
    description: 'Story progress stored with this save',
    type: SaveProgressDto,
  })
  progress: SaveProgressDto;

  @ApiProperty({
    description: 'Inventory items stored with this save',
    type: [InventoryItemDto],
  })
  inventory: InventoryItemDto[];
}

export class SaveListResponseDto {
  @ApiProperty({
    description: 'Save slots owned by the authenticated user',
    type: [SaveResponseDto],
  })
  saves: SaveResponseDto[];
}

export class SaveMessageResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Save deleted.',
    type: String,
  })
  message: string;
}
