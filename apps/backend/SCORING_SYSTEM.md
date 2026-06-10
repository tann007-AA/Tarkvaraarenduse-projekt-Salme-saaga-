# Scoring System API

This document describes the scoring system implementation for the Pell game backend.

## Overview

The scoring system allows tracking multiple score types for each game save. Scores are tied to specific save slots and can be added, updated, retrieved, and deleted.

## Database Schema

### Scores Table

```sql
CREATE TABLE `scores` (
  `id` varchar(36) PRIMARY KEY,
  `save_id` varchar(36) NOT NULL,
  `score_type` varchar(50) NOT NULL,
  `score_value` int NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `unique_save_score` UNIQUE(`save_id`,`score_type`),
  FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE cascade
);
```

**Key Features:**
- Scores are linked to saves (cascade delete when save is deleted)
- Unique constraint ensures one score per type per save
- Score types are flexible strings (e.g., "combat", "exploration", "puzzle")
- Score values are integers (can be positive or negative)

## API Endpoints

All endpoints require JWT authentication (`Authorization: Bearer <token>`).

### 1. Add or Update Score

**POST** `/scores`

Creates a new score or updates an existing one if the score type already exists for the save slot.

**Request Body:**
```json
{
  "slotNumber": 1,
  "scoreType": "combat",
  "scoreValue": 100
}
```

**Response (200 OK):**
```json
{
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "saveId": "b2c3f613-4128-4e3e-83bf-9d346b413f8e",
  "scoreType": "combat",
  "scoreValue": 100,
  "createdAt": "2026-06-09T10:30:00.000Z",
  "updatedAt": "2026-06-09T10:30:00.000Z"
}
```

**Errors:**
- `400` - Invalid score data (invalid slot number, missing fields, etc.)
- `401` - Unauthorized (invalid or missing token)
- `404` - Save slot not found

### 2. Get All Scores for a Save

**GET** `/scores/:slot`

Returns all scores for a specific save slot.

**Parameters:**
- `slot` (path) - Save slot number (1-3)

**Response (200 OK):**
```json
{
  "scores": [
    {
      "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      "saveId": "b2c3f613-4128-4e3e-83bf-9d346b413f8e",
      "scoreType": "combat",
      "scoreValue": 100,
      "createdAt": "2026-06-09T10:30:00.000Z",
      "updatedAt": "2026-06-09T10:30:00.000Z"
    },
    {
      "id": "c2d3e4f5-6789-01bc-def0-1234567890cd",
      "saveId": "b2c3f613-4128-4e3e-83bf-9d346b413f8e",
      "scoreType": "exploration",
      "scoreValue": 75,
      "createdAt": "2026-06-09T10:31:00.000Z",
      "updatedAt": "2026-06-09T10:31:00.000Z"
    }
  ]
}
```

**Errors:**
- `400` - Invalid slot number
- `401` - Unauthorized
- `404` - Save slot not found

### 3. Update a Specific Score

**PUT** `/scores/:slot/:scoreType`

Updates the value of a specific score type for a save slot.

**Parameters:**
- `slot` (path) - Save slot number (1-3)
- `scoreType` (path) - Type of score to update (e.g., "combat")

**Request Body:**
```json
{
  "scoreType": "combat",
  "scoreValue": 150
}
```

**Response (200 OK):**
```json
{
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "saveId": "b2c3f613-4128-4e3e-83bf-9d346b413f8e",
  "scoreType": "combat",
  "scoreValue": 150,
  "createdAt": "2026-06-09T10:30:00.000Z",
  "updatedAt": "2026-06-09T10:45:00.000Z"
}
```

**Errors:**
- `400` - Invalid input data
- `401` - Unauthorized
- `404` - Save slot or score not found

### 4. Delete a Score

**DELETE** `/scores/:slot/:scoreType`

Deletes a specific score type from a save slot.

**Parameters:**
- `slot` (path) - Save slot number (1-3)
- `scoreType` (path) - Type of score to delete (e.g., "combat")

**Response (200 OK):**
```json
{
  "message": "Score deleted successfully."
}
```

**Errors:**
- `400` - Invalid input data
- `401` - Unauthorized
- `404` - Save slot or score not found

## Integration with Save System

When loading saves (via `/saves` or `/saves/:slot`), the response now includes an optional `scores` field:

```json
{
  "id": "b2c3f613-4128-4e3e-83bf-9d346b413f8e",
  "slotNumber": 1,
  "saveName": "Before the voyage",
  "playTimeSeconds": 1840,
  "lastPlayedAt": "2026-06-09T10:45:00.000Z",
  "createdAt": "2026-06-09T10:30:00.000Z",
  "updatedAt": "2026-06-09T10:45:00.000Z",
  "progress": { ... },
  "inventory": [ ... ],
  "scores": [
    {
      "scoreType": "combat",
      "scoreValue": 100
    },
    {
      "scoreType": "exploration",
      "scoreValue": 75
    }
  ]
}
```

The `scores` field is only included if the save has any scores associated with it.

## Database Migration

To apply the schema changes, run the migration:

```bash
cd apps/backend
npx drizzle-kit push
```

Or if using a migration runner:

```bash
npx drizzle-kit migrate
```

The migration file is located at: `drizzle/0006_dry_guardian.sql`

## Implementation Files

- **Schema**: `src/db/schema/scores.schema.ts`
- **Service**: `src/scores/scores.service.ts`
- **Controller**: `src/scores/scores.controller.ts`
- **DTOs**: `src/scores/dto/score.dto.ts`
- **Module**: `src/scores/scores.module.ts`

## Example Usage

### Frontend Integration Example

```typescript
// Add or update a score
async function addScore(slotNumber: number, scoreType: string, scoreValue: number) {
  const response = await fetch('/api/scores', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      slotNumber,
      scoreType,
      scoreValue,
    }),
  });
  return response.json();
}

// Get all scores for a save
async function getScores(slotNumber: number) {
  const response = await fetch(`/api/scores/${slotNumber}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

// Update a specific score
async function updateScore(slotNumber: number, scoreType: string, newValue: number) {
  const response = await fetch(`/api/scores/${slotNumber}/${scoreType}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scoreType,
      scoreValue: newValue,
    }),
  });
  return response.json();
}

// Delete a score
async function deleteScore(slotNumber: number, scoreType: string) {
  const response = await fetch(`/api/scores/${slotNumber}/${scoreType}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}
```

## Score Type Examples

The system is flexible and supports any score type string (up to 50 characters). Common examples:

- `combat` - Combat/battle performance
- `exploration` - Exploration/discovery progress
- `puzzle` - Puzzle-solving performance
- `stealth` - Stealth gameplay performance
- `social` - Social interaction/dialogue choices
- `crafting` - Crafting system progress
- `total` - Overall/cumulative score

## Notes

- Score values can be negative (e.g., for penalties or debts)
- Scores are automatically deleted when their parent save is deleted (cascade)
- The unique constraint prevents duplicate score types per save
- Scores are sorted alphabetically by type when retrieved
