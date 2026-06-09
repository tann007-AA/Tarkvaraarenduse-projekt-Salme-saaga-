const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config({ quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is missing.');
  process.exit(1);
}

async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.query(
    `
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = ?
        AND column_name = ?
      LIMIT 1
    `,
    [tableName, columnName],
  );

  return rows.length > 0;
}

async function tableExists(connection, tableName) {
  const [rows] = await connection.query(
    `
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name = ?
      LIMIT 1
    `,
    [tableName],
  );

  return rows.length > 0;
}

async function indexExists(connection, tableName, indexName) {
  const [rows] = await connection.query(
    `
      SELECT 1
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = ?
        AND index_name = ?
      LIMIT 1
    `,
    [tableName, indexName],
  );

  return rows.length > 0;
}

async function addColumnIfMissing(connection, tableName, columnName, ddl) {
  if (await columnExists(connection, tableName, columnName)) {
    return;
  }

  await connection.query(`ALTER TABLE \`${tableName}\` ADD ${ddl}`);
  console.log(`Added ${tableName}.${columnName}`);
}

async function addIndexIfMissing(connection, tableName, indexName, ddl) {
  if (await indexExists(connection, tableName, indexName)) {
    return;
  }

  await connection.query(ddl);
  console.log(`Added index ${indexName}`);
}

async function repairUsers(connection) {
  await addColumnIfMissing(
    connection,
    'users',
    'username',
    '`username` varchar(50) NULL',
  );
  await addColumnIfMissing(connection, 'users', 'name', '`name` varchar(50) NULL');
  await addColumnIfMissing(
    connection,
    'users',
    'role',
    "`role` enum('user','admin') DEFAULT 'user'",
  );
  await addColumnIfMissing(
    connection,
    'users',
    'last_login_at',
    '`last_login_at` timestamp NULL',
  );

  await connection.query(`
    UPDATE users
    SET username = CONCAT('user_', LEFT(REPLACE(id, '-', ''), 20))
    WHERE username IS NULL OR username = ''
  `);
  await connection.query(`
    UPDATE users
    SET name = COALESCE(NULLIF(name, ''), email, 'User')
    WHERE name IS NULL OR name = ''
  `);
  await connection.query("UPDATE users SET role = 'user' WHERE role IS NULL");
  await connection.query('ALTER TABLE users MODIFY username varchar(50) NOT NULL');
  await connection.query('ALTER TABLE users MODIFY name varchar(50) NOT NULL');
  await addIndexIfMissing(
    connection,
    'users',
    'users_username_unique',
    'ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE(username)',
  );
}

async function repairSaves(connection) {
  if (!(await tableExists(connection, 'saves'))) {
    await connection.query(`
      CREATE TABLE saves (
        id varchar(36) NOT NULL,
        user_id varchar(36) NOT NULL,
        slot_number int NOT NULL,
        save_name varchar(100),
        play_time_seconds int NOT NULL DEFAULT 0,
        last_played_at timestamp NULL,
        created_at timestamp DEFAULT (now()),
        updated_at timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT saves_id PRIMARY KEY(id)
      )
    `);
    console.log('Created saves');
  }

  await addColumnIfMissing(connection, 'saves', 'slot_number', '`slot_number` int NULL');
  await addColumnIfMissing(
    connection,
    'saves',
    'save_name',
    '`save_name` varchar(100) NULL',
  );
  await addColumnIfMissing(
    connection,
    'saves',
    'play_time_seconds',
    '`play_time_seconds` int NOT NULL DEFAULT 0',
  );
  await addColumnIfMissing(
    connection,
    'saves',
    'last_played_at',
    '`last_played_at` timestamp NULL',
  );

  if (await columnExists(connection, 'saves', 'slot')) {
    await connection.query('UPDATE saves SET slot_number = slot WHERE slot_number IS NULL');
  }

  if (await columnExists(connection, 'saves', 'name')) {
    await connection.query('UPDATE saves SET save_name = name WHERE save_name IS NULL');
  }

  await connection.query('UPDATE saves SET slot_number = 1 WHERE slot_number IS NULL');
  await connection.query('ALTER TABLE saves MODIFY slot_number int NOT NULL');
  await connection.query('ALTER TABLE saves MODIFY play_time_seconds int NOT NULL DEFAULT 0');
  await addIndexIfMissing(
    connection,
    'saves',
    'unique_user_slot',
    'ALTER TABLE saves ADD CONSTRAINT unique_user_slot UNIQUE(user_id, slot_number)',
  );
  await addIndexIfMissing(
    connection,
    'saves',
    'user_id_idx',
    'CREATE INDEX user_id_idx ON saves(user_id)',
  );
}

async function repairInventory(connection) {
  if (!(await tableExists(connection, 'inventory_items'))) {
    await connection.query(`
      CREATE TABLE inventory_items (
        id varchar(36) NOT NULL,
        save_id varchar(36) NOT NULL,
        item_id varchar(100) NOT NULL,
        quantity int NOT NULL DEFAULT 1,
        CONSTRAINT inventory_items_id PRIMARY KEY(id)
      )
    `);
    console.log('Created inventory_items');
  }

  await connection.query(
    'ALTER TABLE inventory_items MODIFY item_id varchar(100) NOT NULL',
  );
  await connection.query(
    'ALTER TABLE inventory_items MODIFY quantity int NOT NULL DEFAULT 1',
  );
  await addIndexIfMissing(
    connection,
    'inventory_items',
    'inventory_save_id_idx',
    'CREATE INDEX inventory_save_id_idx ON inventory_items(save_id)',
  );
  await addIndexIfMissing(
    connection,
    'inventory_items',
    'unique_item_per_save',
    'ALTER TABLE inventory_items ADD CONSTRAINT unique_item_per_save UNIQUE(save_id, item_id)',
  );
}

async function repairProgress(connection) {
  if (await tableExists(connection, 'progress')) {
    return;
  }

  await connection.query(`
    CREATE TABLE progress (
      save_id varchar(36) NOT NULL,
      current_chapter int NOT NULL DEFAULT 1,
      completed_quest_count int NOT NULL DEFAULT 0,
      completed_ending_a boolean NOT NULL DEFAULT false,
      completed_ending_b boolean NOT NULL DEFAULT false,
      CONSTRAINT progress_save_id PRIMARY KEY(save_id)
    )
  `);
  console.log('Created progress');
}

async function main() {
  const connection = await mysql.createConnection(databaseUrl);

  try {
    await repairUsers(connection);
    await repairSaves(connection);
    await repairInventory(connection);
    await repairProgress(connection);
    console.log('Development database repaired.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
