import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Link, Drawer, Typography } from '@material-ui/core';
// hooks
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// components
// import Logo from '../../components/Logo';

import MyAvatar from '../../components/MyAvatar';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
//
import sidebarConfig from './SidebarConfig';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12]
}));

// const DocStyle = styled('div')(({ theme }) => ({
//   padding: theme.spacing(2.5),
//   borderRadius: theme.shape.borderRadiusMd,
//   backgroundColor:
//     theme.palette.mode === 'light'
//       ? alpha(theme.palette.primary.main, 0.08)
//       : theme.palette.primary.lighter
// }));

// ----------------------------------------------------------------------

type DashboardSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          {/* <Logo /> */}
          <img src="/static/common/logo.png" alt="Logo" />
        </Box>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      {/* Logged In User */}
      {/* mx: 2.5, */}
      <Box
        sx={{
          mb: 2,
          margin: 'auto',
          position: 'absolute',
          bottom: 20,
          width: '100%',
          padding: '0 20px'
        }}
      >
        <Link underline="none" component={RouterLink} to={PATH_DASHBOARD.user.account}>
          <AccountStyle>
            <MyAvatar />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user?.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>

        <Link underline="none" component={RouterLink} to={PATH_AUTH.login}>
          <Box
            sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            Sign Out
          </Box>
        </Link>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: { width: DRAWER_WIDTH, bgcolor: 'background.default' }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
