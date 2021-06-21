// ----------------------------------------------------------------------

export type SongLabelId = 'all' | 'latest';

export type SongLabel = {
  id: SongLabelId;
  type: string;
  name: string;
  unreadCount: number;
  color?: string;
};

export type Song = {
  id: string;
  labelIds?: string[];
  title: string;
  duration: string;
  artist: string; // ID
  album: string; // ID
  genre: string; // ID
  folder?: string | undefined;
  isStarred?: boolean;
  isUnread?: boolean;
  subject?: string;
  message?: string;
  createdAt?: Date;
};
