// ----------------------------------------------------------------------

export type ArtistLabelId =
  | 'all'
  | 'inbox'
  | 'sent'
  | 'drafts'
  | 'trash'
  | 'spam'
  | 'important'
  | 'starred'
  | 'id_social'
  | 'id_promotions'
  | 'id_forums';

export type ArtistLabel = {
  id: ArtistLabelId;
  type: string;
  name: string;
  unreadCount: number;
  color?: string;
};

export type Artist = {
  id: string;
  labelIds: string[];
  folder: string | undefined;
  isImportant: boolean;
  isStarred: boolean;
  isUnread: boolean;
  subject: string;
  message: string;
  createdAt: Date;
};
