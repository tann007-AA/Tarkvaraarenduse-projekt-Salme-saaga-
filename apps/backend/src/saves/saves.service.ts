import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { randomUUID } from 'node:crypto';
import { DRIZZLE } from '../db/db.module';
import { saves } from '../db/schema/gamesave.schema';
import { inventoryItems } from '../db/schema/inventory.schema';
import { progress } from '../db/schema/progress.schema';
import { scores } from '../db/schema/scores.schema';
import type { InventoryItemDto, SaveGameDto } from './dto';

const MAX_SAVE_SLOTS = 3;
const MAX_SAVE_NAME_LENGTH = 100;

type NormalizedSaveInput = {
  slotNumber: number;
  saveName: string | null;
  playTimeSeconds: number;
  currentChapter: number;
  completedQuestCount: number;
  completedEndingA: boolean;
  completedEndingB: boolean;
  inventory: Required<InventoryItemDto>[];
};

type SaveRow = {
  id: string;
  slotNumber: number;
  saveName: string | null;
  playTimeSeconds: number;
  lastPlayedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type ProgressRow = {
  currentChapter: number;
  completedQuestCount: number;
  completedEndingA: boolean;
  completedEndingB: boolean;
};

@Injectable()
export class SavesService {
  constructor(@Inject(DRIZZLE) private readonly db: MySql2Database) { }

  async saveGame(userId: string, input: SaveGameDto) {
    const normalizedSave = this.normalizeSave(input);
    const now = new Date();
    const existingSave = await this.findSaveRow(
      userId,
      normalizedSave.slotNumber,
    );
    const saveId = existingSave?.id ?? randomUUID();

    if (existingSave) {
      await this.db
        .update(saves)
        .set({
          saveName: normalizedSave.saveName,
          playTimeSeconds: normalizedSave.playTimeSeconds,
          lastPlayedAt: now,
        })
        .where(
          and(
            eq(saves.userId, userId),
            eq(saves.slotNumber, normalizedSave.slotNumber),
          ),
        );
    } else {
      await this.db.insert(saves).values({
        id: saveId,
        userId,
        slotNumber: normalizedSave.slotNumber,
        saveName: normalizedSave.saveName,
        playTimeSeconds: normalizedSave.playTimeSeconds,
        lastPlayedAt: now,
      });
    }

    await this.replaceProgress(saveId, normalizedSave);
    await this.replaceInventory(saveId, normalizedSave.inventory);

    const savedGame = await this.getSaveBySlot(
      userId,
      normalizedSave.slotNumber,
    );

    if (!savedGame) {
      throw new NotFoundException('Save slot not found after saving.');
    }

    return savedGame;
  }

  async loadSaves(userId: string) {
    const saveRows = await this.db
      .select({
        id: saves.id,
        slotNumber: saves.slotNumber,
        saveName: saves.saveName,
        playTimeSeconds: saves.playTimeSeconds,
        lastPlayedAt: saves.lastPlayedAt,
        createdAt: saves.createdAt,
        updatedAt: saves.updatedAt,
      })
      .from(saves)
      .where(eq(saves.userId, userId))
      .orderBy(asc(saves.slotNumber));

    const saveResponses = await Promise.all(
      saveRows.map((saveRow) => this.hydrateSave(saveRow)),
    );

    return { saves: saveResponses };
  }

  async loadSave(userId: string, slotParam: string) {
    const slotNumber = this.parseSlot(slotParam);
    const save = await this.getSaveBySlot(userId, slotNumber);

    if (!save) {
      throw new NotFoundException('Save slot not found.');
    }

    return save;
  }

  async deleteSave(userId: string, slotParam: string) {
    const slotNumber = this.parseSlot(slotParam);
    const [existingSave] = await this.db
      .select({ id: saves.id })
      .from(saves)
      .where(and(eq(saves.userId, userId), eq(saves.slotNumber, slotNumber)));

    if (!existingSave) {
      throw new NotFoundException('Save slot not found.');
    }

    await this.db.delete(saves).where(eq(saves.id, existingSave.id));

    return { message: 'Save deleted.' };
  }

  private async getSaveBySlot(userId: string, slotNumber: number) {
    const saveRow = await this.findSaveRow(userId, slotNumber);

    if (!saveRow) {
      return null;
    }

    return this.hydrateSave(saveRow);
  }

  private async findSaveRow(userId: string, slotNumber: number) {
    const [saveRow] = await this.db
      .select({
        id: saves.id,
        slotNumber: saves.slotNumber,
        saveName: saves.saveName,
        playTimeSeconds: saves.playTimeSeconds,
        lastPlayedAt: saves.lastPlayedAt,
        createdAt: saves.createdAt,
        updatedAt: saves.updatedAt,
      })
      .from(saves)
      .where(and(eq(saves.userId, userId), eq(saves.slotNumber, slotNumber)));

    return saveRow;
  }

  private async replaceProgress(
    saveId: string,
    normalizedSave: NormalizedSaveInput,
  ) {
    await this.db.delete(progress).where(eq(progress.saveId, saveId));
    await this.db.insert(progress).values({
      saveId,
      currentChapter: normalizedSave.currentChapter,
      completedQuestCount: normalizedSave.completedQuestCount,
      completedEndingA: normalizedSave.completedEndingA,
      completedEndingB: normalizedSave.completedEndingB,
    });
  }

  private async replaceInventory(
    saveId: string,
    normalizedInventory: Required<InventoryItemDto>[],
  ) {
    await this.db
      .delete(inventoryItems)
      .where(eq(inventoryItems.saveId, saveId));

    if (normalizedInventory.length === 0) {
      return;
    }

    await this.db.insert(inventoryItems).values(
      normalizedInventory.map((item) => ({
        id: randomUUID(),
        saveId,
        itemId: item.itemId,
        quantity: item.quantity,
      })),
    );
  }

  private async hydrateSave(saveRow: SaveRow) {
    const [progressRow] = await this.db
      .select({
        currentChapter: progress.currentChapter,
        completedQuestCount: progress.completedQuestCount,
        completedEndingA: progress.completedEndingA,
        completedEndingB: progress.completedEndingB,
      })
      .from(progress)
      .where(eq(progress.saveId, saveRow.id));

    const inventory = await this.db
      .select({
        itemId: inventoryItems.itemId,
        quantity: inventoryItems.quantity,
      })
      .from(inventoryItems)
      .where(eq(inventoryItems.saveId, saveRow.id))
      .orderBy(asc(inventoryItems.itemId));

    const scoreRows = await this.db
      .select({
        scoreType: scores.scoreType,
        scoreValue: scores.scoreValue,
      })
      .from(scores)
      .where(eq(scores.saveId, saveRow.id))
      .orderBy(asc(scores.scoreType));

    return this.toSaveResponse(saveRow, progressRow, inventory, scoreRows);
  }

  private normalizeSave(input: SaveGameDto): NormalizedSaveInput {
    const slotNumber = this.validateSlot(input.slotNumber);
    const saveName = this.normalizeSaveName(input.saveName);

    return {
      slotNumber,
      saveName,
      playTimeSeconds: this.validateNonNegativeInteger(
        input.playTimeSeconds ?? 0,
        'Play time',
      ),
      currentChapter: this.validatePositiveInteger(
        input.currentChapter ?? 1,
        'Current chapter',
      ),
      completedQuestCount: this.validateNonNegativeInteger(
        input.completedQuestCount ?? 0,
        'Completed quest count',
      ),
      completedEndingA: this.normalizeBoolean(input.completedEndingA),
      completedEndingB: this.normalizeBoolean(input.completedEndingB),
      inventory: this.normalizeInventory(input.inventory),
    };
  }

  private parseSlot(slotParam: string) {
    const slotNumber = Number(slotParam);

    return this.validateSlot(slotNumber);
  }

  private validateSlot(slotNumber: number) {
    if (
      !Number.isInteger(slotNumber) ||
      slotNumber < 1 ||
      slotNumber > MAX_SAVE_SLOTS
    ) {
      throw new BadRequestException(
        `Slot number must be an integer between 1 and ${MAX_SAVE_SLOTS}.`,
      );
    }

    return slotNumber;
  }

  private normalizeSaveName(saveName?: string) {
    const normalizedSaveName = saveName?.trim();

    if (!normalizedSaveName) {
      return null;
    }

    if (normalizedSaveName.length > MAX_SAVE_NAME_LENGTH) {
      throw new BadRequestException(
        `Save name must be at most ${MAX_SAVE_NAME_LENGTH} characters.`,
      );
    }

    return normalizedSaveName;
  }

  private validatePositiveInteger(value: number, fieldName: string) {
    if (!Number.isInteger(value) || value < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer.`);
    }

    return value;
  }

  private validateNonNegativeInteger(value: number, fieldName: string) {
    if (!Number.isInteger(value) || value < 0) {
      throw new BadRequestException(
        `${fieldName} must be a non-negative integer.`,
      );
    }

    return value;
  }

  private normalizeBoolean(value?: boolean) {
    if (value === undefined) {
      return false;
    }

    if (typeof value !== 'boolean') {
      throw new BadRequestException(
        'Ending completion flags must be booleans.',
      );
    }

    return value;
  }

  private normalizeInventory(inventory?: InventoryItemDto[]) {
    if (inventory === undefined) {
      return [];
    }

    if (!Array.isArray(inventory)) {
      throw new BadRequestException('Inventory must be an array.');
    }

    const inventoryByItemId = new Map<string, Required<InventoryItemDto>>();

    for (const item of inventory) {
      const itemId = item.itemId?.trim();

      if (!itemId) {
        throw new BadRequestException('Inventory item id is required.');
      }

      if (itemId.length > MAX_SAVE_NAME_LENGTH) {
        throw new BadRequestException(
          `Inventory item id must be at most ${MAX_SAVE_NAME_LENGTH} characters.`,
        );
      }

      const quantity = this.validatePositiveInteger(
        item.quantity ?? 1,
        'Inventory quantity',
      );
      inventoryByItemId.set(itemId, { itemId, quantity });
    }

    return [...inventoryByItemId.values()];
  }

  private toSaveResponse(
    saveRow: SaveRow,
    progressRow: ProgressRow | undefined,
    inventory: Required<InventoryItemDto>[],
    scoreRows: { scoreType: string; scoreValue: number }[],
  ) {
    return {
      id: saveRow.id,
      slotNumber: saveRow.slotNumber,
      saveName: saveRow.saveName,
      playTimeSeconds: saveRow.playTimeSeconds,
      lastPlayedAt: this.toIsoString(saveRow.lastPlayedAt),
      createdAt: this.toIsoString(saveRow.createdAt),
      updatedAt: this.toIsoString(saveRow.updatedAt),
      progress: {
        currentChapter: progressRow?.currentChapter ?? 1,
        completedQuestCount: progressRow?.completedQuestCount ?? 0,
        completedEndingA: progressRow?.completedEndingA ?? false,
        completedEndingB: progressRow?.completedEndingB ?? false,
      },
      inventory,
      scores: scoreRows.length > 0 ? scoreRows : undefined,
    };
  }

  private toIsoString(value: Date | null) {
    return value?.toISOString() ?? null;
  }
}
