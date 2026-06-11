import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  InventoryMessageResponseDto,
  InventoryResponseDto,
  ReplaceInventoryDto,
  UpsertInventoryItemDto,
} from './dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saves/:slot/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get inventory for a save slot',
    description:
      'Returns the items Bjorn has collected or packed, such as food supplies, sunstone, or the kodumulla paun.',
  })
  @ApiParam({ name: 'slot', example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Inventory loaded successfully',
    type: InventoryResponseDto,
  })
  getInventory(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
  ) {
    return this.inventoryService.getInventory(user.id, slot);
  }

  @Put()
  @ApiOperation({
    summary: 'Replace inventory for a save slot',
    description:
      'Stores a complete inventory state for drag-and-drop or cargo loading interactions.',
  })
  @ApiParam({ name: 'slot', example: 1, type: Number })
  @ApiBody({ type: ReplaceInventoryDto })
  @ApiResponse({
    status: 200,
    description: 'Inventory replaced successfully',
    type: InventoryResponseDto,
  })
  replaceInventory(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
    @Body() body: ReplaceInventoryDto,
  ) {
    return this.inventoryService.replaceInventory(user.id, slot, body);
  }

  @Put('items')
  @ApiOperation({
    summary: 'Create or update one inventory item',
    description:
      'Sets the quantity for one item in the save inventory. Reusing an item id overwrites its quantity.',
  })
  @ApiParam({ name: 'slot', example: 1, type: Number })
  @ApiBody({ type: UpsertInventoryItemDto })
  @ApiResponse({
    status: 200,
    description: 'Inventory item stored successfully',
    type: InventoryResponseDto,
  })
  upsertItem(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
    @Body() body: UpsertInventoryItemDto,
  ) {
    return this.inventoryService.upsertItem(user.id, slot, body);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove one inventory item',
    description:
      'Removes an item from the inventory for the selected save slot.',
  })
  @ApiParam({ name: 'slot', example: 1, type: Number })
  @ApiParam({ name: 'itemId', example: 'sunstone', type: String })
  @ApiResponse({
    status: 200,
    description: 'Inventory item removed successfully',
    type: InventoryMessageResponseDto,
  })
  removeItem(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
    @Param('itemId') itemId: string,
  ) {
    return this.inventoryService.removeItem(user.id, slot, itemId);
  }
}
