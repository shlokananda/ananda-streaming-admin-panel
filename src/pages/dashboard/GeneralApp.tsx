// material
import { Container, Grid } from '@material-ui/core';
// hooks
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppFeatured,
  AppTotalDownloads,
  AppTotalInstalled,
  AppTotalActiveUsers
} from '../../components/_dashboard/general-app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  return (
    <Page title="Dashboard: App | Minimal-UI">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome displayName={user?.displayName} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalActiveUsers />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalInstalled />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalDownloads />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
