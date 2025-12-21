import { db } from './meetingdatabase';

/**
 * Insert a meeting row
 */
export const insertMeeting = async ({
  title,
  audioUri,
  duration,
  startedAt,
  endedAt,
  groupId,
}: {
  title: string;
  audioUri: string;
  duration: number;
  startedAt: string;
  endedAt: string;
  groupId: number;
}) => {
  await db.runAsync(
    `
    INSERT INTO meetings (
      title,
      audio_uri,
      duration,
      group_id,
      started_at,
      ended_at,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `,
    [
      title,
      audioUri,
      duration,
      groupId,
      startedAt,
      endedAt,
    ]
  );
  const rows = await db.getAllAsync('SELECT * FROM meetings');
  console.log(rows);

};


/**
 * Fetch all meetings (for later screens)
 */
export const getAllMeetings = async () => {
  return await db.getAllAsync(`
    SELECT meetings.*, groups.name as group_name
    FROM meetings
    LEFT JOIN groups ON meetings.group_id = groups.id
    ORDER BY meetings.created_at DESC
  `);
};


/**
 * Get recent meetings (home/Notes overview)
 */

export type RecentMeeting = {
  id: number;
  title: string;
  created_at: string;
  started_at: string;
  group_name: string;
};

export const getRecentMeetings = async (): Promise<RecentMeeting[]> => {
  return await db.getAllAsync<RecentMeeting>(`
    SELECT 
      m.id,
      m.title,
      m.created_at,
      m.started_at,
      g.name as group_name
    FROM meetings m
    JOIN groups g ON g.id = m.group_id
    ORDER BY m.created_at DESC
    LIMIT 5;
  `);
};


/**
 * Get meetings by group
 */
export const getMeetingsByGroup = async (groupId: number) => {
  return await db.getAllAsync(`
    SELECT *
    FROM meetings
    WHERE group_id = ?
    ORDER BY started_at DESC;
  `, [groupId]);
};

/**
 * Search meetings
 */

export const searchMeetings = async (query: string) => {
  return await db.getAllAsync(`
    SELECT m.*, g.name as group_name
    FROM meetings m
    JOIN groups g ON g.id = m.group_id
    WHERE m.title LIKE ?
    ORDER BY started_at DESC;
  `, [`%${query}%`]);
};
