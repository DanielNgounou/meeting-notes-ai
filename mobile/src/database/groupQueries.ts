import { db } from './meetingdatabase';

/**
 * Insert group if it doesn't exist.
 * Always returns a group_id.
 */
export const insertOrGetGroup = async (name: string): Promise<number> => {
  // Insert if not exists
  await db.runAsync(
    `INSERT OR IGNORE INTO groups (name, created_at)
     VALUES (?, datetime('now'))`,
    [name]
  );

  // Fetch id
  const rows = await db.getAllAsync<{ id: number }>(
    `SELECT id FROM groups WHERE name = ?`,
    [name]
  );

  return rows[0].id;
};

/**
 * Fetch all groups (for dropdown)
 */
export const getAllGroups = async (): Promise<string[]> => {
  const rows = await db.getAllAsync<{ name: string }>(
    `SELECT name FROM groups ORDER BY created_at DESC`
  );
  return rows.map(r => r.name);
};
