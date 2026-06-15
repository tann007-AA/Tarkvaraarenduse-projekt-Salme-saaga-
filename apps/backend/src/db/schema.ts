export { users } from './schema/users.schema';
export { sessions } from './schema/sessions.schema';
export { progress } from './schema/progress.schema';
export { inventoryItems } from './schema/inventory.schema';
export { saves } from './schema/gamesave.schema';
export { scores } from './schema/scores.schema';

export { players } from './schema/board-game/players.schema';
export { lobbies } from './schema/board-game/lobbies.schema';
export { gameSessions } from './schema/board-game/sessions.schema';
export { moves } from './schema/board-game/moves.schema';

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { players as _players } from './schema/board-game/players.schema';
import { lobbies as _lobbies } from './schema/board-game/lobbies.schema';
import { gameSessions as _gameSessions } from './schema/board-game/sessions.schema';
import { moves as _moves } from './schema/board-game/moves.schema';

export type Player = InferSelectModel<typeof _players>;
export type NewPlayer = InferInsertModel<typeof _players>;
export type Lobby = InferSelectModel<typeof _lobbies>;
export type NewLobby = InferInsertModel<typeof _lobbies>;
export type GameSession = InferSelectModel<typeof _gameSessions>;
export type NewGameSession = InferInsertModel<typeof _gameSessions>;
export type Move = InferSelectModel<typeof _moves>;
export type NewMove = InferInsertModel<typeof _moves>;
