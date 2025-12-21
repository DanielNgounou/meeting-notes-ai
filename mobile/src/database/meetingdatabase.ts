import * as SQLite from 'expo-sqlite';

export let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync('meetingdatabase.db');

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      audio_uri TEXT NOT NULL,
      duration INTEGER NOT NULL,
      group_id INTEGER,
      started_at TEXT,
      ended_at TEXT,
      created_at TEXT,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    );
  `);

  console.log('✅ SQLite database initialized');
};


