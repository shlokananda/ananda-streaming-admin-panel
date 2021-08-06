// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  artist: getIcon('ic_artist'),
  song: getIcon('ic_song'),
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban')
};

const sidebarConfig = [
  // GENERAL
  {
    subheader: 'management',
    items: [
      {
        title: 'dashboard',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      { title: 'artist', path: PATH_DASHBOARD.artist.root, icon: ICONS.artist },
      { title: 'song', path: PATH_DASHBOARD.song.root, icon: ICONS.song },
      // { title: 'mail', path: PATH_DASHBOARD.mail.root, icon: ICONS.mail },
      // { title: 'user', path: PATH_DASHBOARD.user.list, icon: ICONS.artist }
      // { title: 'album', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      // { title: 'playlist', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics }
    ]
  }
];

export default sidebarConfig;
