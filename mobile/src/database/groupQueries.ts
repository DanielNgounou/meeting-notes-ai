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


/**
 * Get all groups with numbers 
 */
export type GroupWithCount = {
  id: number;
  name: string;
  recordings: number;
};

export const getGroupsWithCount = async (): Promise<GroupWithCount[]> => {
  return db.getAllAsync<GroupWithCount>(`
    SELECT 
      g.id,
      g.name,
      COUNT(m.id) as recordings
    FROM groups g
    LEFT JOIN meetings m ON m.group_id = g.id
    GROUP BY g.id
    ORDER BY g.name ASC
  `);
};




