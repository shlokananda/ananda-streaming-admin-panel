import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// material
import { Container, Card } from '@material-ui/core';
// redux
import { useDispatch } from '../../redux/store';
import { getLabels } from '../../redux/slices/mail';
// routes
// components
import Page from '../../components/Page';
import { ArtistList, ArtistDetails, ArtistSidebar } from '../../components/_dashboard/artist';

// ----------------------------------------------------------------------

export default function Artist() {
  const dispatch = useDispatch();
  const { mailId = '' } = useParams();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openCompose, setOpenCompose] = useState(false);

  useEffect(() => {
    dispatch(getLabels());
  }, [dispatch]);

  return (
    <Page title="Artist | Minimal-UI">
      <Container maxWidth="xl">
        <Card sx={{ height: { md: '72vh' }, display: { md: 'flex' } }}>
          <ArtistSidebar
            isOpenSidebar={openSidebar}
            onCloseSidebar={() => setOpenSidebar(false)}
            onOpenCompose={() => setOpenCompose(true)}
          />
          {mailId ? <ArtistDetails /> : <ArtistList onOpenSidebar={() => setOpenSidebar(true)} />}
        </Card>
      </Container>
    </Page>
  );
}
