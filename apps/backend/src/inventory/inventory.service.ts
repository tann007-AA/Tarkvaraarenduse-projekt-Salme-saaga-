import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { randomUUID } from 'node:crypto';
import { DRIZZLE } from '../db/db.constants';
import { saves } from '../db/schema/gamesave.schema';
import { inventoryItems } from '../db/schema/inventory.schema';
import type { ReplaceInventoryDto, UpsertInventoryItemDto } from './dto';

const MAX_SAVE_SLOTS = 3;
const MAX_ITEM_ID_LENGTH = 100;

type NormalizedInventoryItem = {
  itemId: string;
  quantity: number;
};

@Injectable()
export class InventoryService {
  constructor(@Inject(DRIZZLE) private readonly db: MySql2Database) {}

  async getInventory(userId: string, slotParam: string) {
    const { id: saveId, slotNumber } = await this.getSaveForUser(
      userId,
      slotParam,
    );
    const inventory = await this.findInventory(saveId);

    return { slotNumber, inventory };
  }

  async replaceInventory(
    userId: string,
    slotParam: string,
    input: ReplaceInventoryDto,
  ) {
    const normalizedInventory = this.normalizeInventory(input.inventory);
    const { id: saveId, slotNumber } = await this.getSaveForUser(
      userId,
      slotParam,
    );

    await this.db
      .delete(inventoryItems)
      .where(eq(inventoryItems.saveId, saveId));

    if (normalizedInventory.length > 0) {
      await this.db.insert(inventoryItems).values(
        normalizedInventory.map((item) => ({
          id: randomUUID(),
          saveId,
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      );
    }

    return {
      slotNumber,
      inventory: await this.findInventory(saveId),
    };
  }

  async upsertItem(
    userId: string,
    slotParam: string,
    input: UpsertInventoryItemDto,
  ) {
    const item = this.normalizeItem(input);
    const { id: saveId, slotNumber } = await this.getSaveForUser(
      userId,
      slotParam,
    );

    const [existingItem] = await this.db
      .select({ id: inventoryItems.id })
      .from(inventoryItems)
      .where(
        and(
          eq(inventoryItems.saveId, saveId),
          eq(inventoryItems.itemId, item.itemId),
        ),
      );

    if (existingItem) {
      await this.db
        .update(inventoryItems)
        .set({ quantity: item.quantity })
        .where(eq(inventoryItems.id, existingItem.id));
    } else {
      await this.db.insert(inventoryItems).values({
        id: randomUUID(),
        saveId,
        itemId: item.itemId,
        quantity: item.quantity,
      });
    }

    return {
      slotNumber,
      inventory: await this.findInventory(saveId),
    };
  }

  async removeItem(userId: string, slotParam: string, itemIdParam: string) {
    const itemId = this.normalizeItemId(itemIdParam);
    const { id: saveId } = await this.getSaveForUser(userId, slotParam);
    const [existingItem] = await this.db
      .select({ id: inventoryItems.id })
      .from(inventoryItems)
      .where(
        and(
          eq(inventoryItems.saveId, saveId),
          eq(inventoryItems.itemId, itemId),
        ),
      );

    if (!existingItem) {
      throw new NotFoundException('Inventory item not found.');
    }

    await this.db
      .delete(inventoryItems)
      .where(eq(inventoryItems.id, existingItem.id));

    return { message: 'Inventory item removed.' };
  }

  private async getSaveForUser(userId: string, slotParam: string) {
    const slotNumber = this.parseSlot(slotParam);
    const [save] = await this.db
      .select({ id: saves.id, slotNumber: saves.slotNumber })
      .from(saves)
      .where(and(eq(saves.userId, userId), eq(saves.slotNumber, slotNumber)));

    if (!save) {
      throw new NotFoundException('Save slot not found.');
    }

    return save;
  }

  private async findInventory(saveId: string) {
    return this.db
      .select({
        itemId: inventoryItems.itemId,
        quantity: inventoryItems.quantity,
      })
      .from(inventoryItems)
      .where(eq(inventoryItems.saveId, saveId))
      .orderBy(asc(inventoryItems.itemId));
  }

  private normalizeInventory(input: UpsertInventoryItemDto[] | undefined) {
    if (!Array.isArray(input)) {
      throw new BadRequestException('Inventory must be an array.');
    }

    const inventoryByItemId = new Map<string, NormalizedInventoryItem>();

    for (const item of input) {
      const normalizedItem = this.normalizeItem(item);
      inventoryByItemId.set(normalizedItem.itemId, normalizedItem);
    }

    return [...inventoryByItemId.values()];
  }

  private normalizeItem(input: UpsertInventoryItemDto) {
    return {
      itemId: this.normalizeItemId(input.itemId),
      quantity: this.validatePositiveInteger(input.quantity ?? 1, 'Quantity'),
    };
  }

  private normalizeItemId(itemId: string | undefined) {
    const normalizedItemId = itemId?.trim();

    if (!normalizedItemId) {
      throw new BadRequestException('Inventory item id is required.');
    }

    if (normalizedItemId.length > MAX_ITEM_ID_LENGTH) {
      throw new BadRequestException(
        `Inventory item id must be at most ${MAX_ITEM_ID_LENGTH} characters.`,
      );
    }

    return normalizedItemId;
  }

  private parseSlot(slotParam: string) {
    const slotNumber = Number(slotParam);

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

  private validatePositiveInteger(value: number, fieldName: string) {
    if (!Number.isInteger(value) || value < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer.`);
    }

    return value;
  }
}
