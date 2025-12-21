import { db } from './meetingdatabase';

/**
 * Insert a meeting row
 */
export const insertMeeting = async ({
  title,
  audioUri,
  duration,
  groupId,
}: {
  title: string;
  audioUri: string;
  duration: number;
  groupId: number;
}) => {
  await db.runAsync(
    `INSERT INTO meetings (
      title,
      audio_uri,
      duration,
      group_id,
      created_at
    ) VALUES (?, ?, ?, ?, datetime('now'))`,
    [title, audioUri, duration, groupId]
  );
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
