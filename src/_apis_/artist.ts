import faker from 'faker';
import { sample } from 'lodash';
// utils
import mock from './mock';
// @types
import { Artist, ArtistLabel } from '../@types/artist';

// ----------------------------------------------------------------------

const createId = (index: number | string) => `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${index}`;

const createLabelIds = (index: number) => {
  if (index === 1) {
    return ['id_promotions', 'id_forums'];
  }
  if (index === 2) {
    return ['id_forums'];
  }
  if (index === 5) {
    return ['id_social'];
  }
  return [];
};

const FOLDER = ['promotions', 'spam', 'inbox', 'folder'];

// ----------------------------------------------------------------------

const labels: ArtistLabel[] = [
  { id: 'all', type: 'system', name: 'all artist', unreadCount: 3 },
  { id: 'inbox', type: 'system', name: 'inbox', unreadCount: 1 },
  { id: 'sent', type: 'system', name: 'sent', unreadCount: 0 },
  { id: 'drafts', type: 'system', name: 'drafts', unreadCount: 0 },
  { id: 'trash', type: 'system', name: 'trash', unreadCount: 0 },
  { id: 'spam', type: 'system', name: 'spam', unreadCount: 1 },
  { id: 'important', type: 'system', name: 'important', unreadCount: 1 },
  { id: 'starred', type: 'system', name: 'starred', unreadCount: 1 },
  {
    id: 'id_social',
    type: 'custom',
    name: 'social',
    unreadCount: 0,
    color: '#00AB55'
  },
  {
    id: 'id_promotions',
    type: 'custom',
    name: 'promotions',
    unreadCount: 2,
    color: '#1890FF'
  },
  {
    id: 'id_forums',
    type: 'custom',
    name: 'forums',
    unreadCount: 1,
    color: '#FFC107'
  }
];

const artists: Artist[] = [...Array(9)].map((artist, index) => {
  const setIndex = index + 1;
  return {
    id: createId(setIndex),
    labelIds: createLabelIds(setIndex),
    folder: sample(FOLDER),
    isImportant: faker.datatype.boolean(),
    isStarred: faker.datatype.boolean(),
    isUnread: faker.datatype.boolean(),
    subject: faker.lorem.words(),
    message: faker.lorem.paragraphs(),
    createdAt: faker.date.past()
  };
});

// ----------------------------------------------------------------------

const filterArtists = (
  artists: Artist[],
  labels: ArtistLabel[],
  systemLabel: string,
  customLabel: string
) => {
  if (customLabel) {
    const label = labels.find((_label) => _label.name === customLabel);
    if (!label) {
      return [];
    }
    return artists.filter((artist) => artist.labelIds.includes(label.id));
  }

  if (systemLabel === 'all') {
    return artists;
  }

  if (['starred', 'important'].includes(systemLabel)) {
    if (systemLabel === 'starred') {
      return artists.filter((artist) => artist.isStarred);
    }
    if (systemLabel === 'important') {
      return artists.filter((artist) => artist.isImportant);
    }
  }

  if (['inbox', 'sent', 'drafts', 'trash', 'spam', 'starred'].includes(systemLabel)) {
    return artists.filter((artist) => artist.folder === systemLabel);
  }

  return [];
};

// ----------------------------------------------------------------------

mock.onGet('/api/artist/labels').reply(200, { labels });

// ----------------------------------------------------------------------

mock.onGet('/api/artist/artists').reply((config) => {
  try {
    const { systemLabel, customLabel } = config.params;
    const filteredArtists = filterArtists(artists, labels, systemLabel, customLabel);
    return [200, { artists: filteredArtists }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onGet('/api/artist/artist').reply((config) => {
  try {
    const { artistId } = config.params;
    const artist = artists.find((_artist) => _artist.id === artistId);
    if (!artist) {
      return [404, { message: 'Artist not found' }];
    }
    return [200, { artist }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});
