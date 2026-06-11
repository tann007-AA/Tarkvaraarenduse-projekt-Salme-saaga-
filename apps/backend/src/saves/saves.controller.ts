import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
  SaveGameDto,
  SaveListResponseDto,
  SaveMessageResponseDto,
  SaveResponseDto,
} from './dto';
import { SavesService } from './saves.service';

@ApiTags('Saves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saves')
export class SavesController {
  constructor(private readonly savesService: SavesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create or update a save slot',
    description:
      'Stores the authenticated player progress, inventory, and play time for a save slot. Reusing a slot overwrites that slot.',
  })
  @ApiBody({ type: SaveGameDto })
  @ApiResponse({
    status: 200,
    description: 'Save slot stored successfully',
    type: SaveResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid save payload' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  saveGame(@CurrentUser() user: { id: string }, @Body() body: SaveGameDto) {
    return this.savesService.saveGame(user.id, body);
  }

  @Get()
  @ApiOperation({
    summary: 'List save slots',
    description:
      'Returns all save slots owned by the authenticated player, including progress and inventory for each slot.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of player save slots',
    type: SaveListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  loadSaves(@CurrentUser() user: { id: string }) {
    return this.savesService.loadSaves(user.id);
  }

  @Get(':slot')
  @ApiOperation({
    summary: 'Load one save slot',
    description:
      'Returns the full saved game state for a single slot owned by the authenticated player.',
  })
  @ApiParam({
    name: 'slot',
    description: 'Save slot number',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Save slot loaded successfully',
    type: SaveResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid slot number' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'Save slot not found' })
  loadSave(@CurrentUser() user: { id: string }, @Param('slot') slot: string) {
    return this.savesService.loadSave(user.id, slot);
  }

  @Delete(':slot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete one save slot',
    description:
      'Deletes a single save slot owned by the authenticated player.',
  })
  @ApiParam({
    name: 'slot',
    description: 'Save slot number',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Save slot deleted successfully',
    type: SaveMessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid slot number' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'Save slot not found' })
  deleteSave(@CurrentUser() user: { id: string }, @Param('slot') slot: string) {
    return this.savesService.deleteSave(user.id, slot);
  }
}
