import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Box, List, Drawer, Button, Divider } from '@material-ui/core';
// redux
import { RootState, useSelector } from '../../../redux/store';
//
import { MHidden } from '../../@material-extend';
import Scrollbar from '../../Scrollbar';
import ArtistSidebarItem from './ArtistSidebarItem';

// ----------------------------------------------------------------------

type ArtistSidebarProps = {
  isOpenSidebar: boolean;
  onOpenCompose: VoidFunction;
  onCloseSidebar: VoidFunction;
};

export default function ArtistSidebar({
  isOpenSidebar,
  onOpenCompose,
  onCloseSidebar
}: ArtistSidebarProps) {
  const { pathname } = useLocation();
  const { labels: artists } = useSelector((state: RootState) => state.artist);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenCompose = () => {
    onCloseSidebar();
    onOpenCompose();
  };

  const renderContent = (
    <Scrollbar>
      <Box sx={{ p: 3 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
          onClick={handleOpenCompose}
        >
          Add Artist
        </Button>
      </Box>

      <Divider />

      <List disablePadding>
        {artists.map((artist: any) => (
          <ArtistSidebarItem key={artist.id} label={artist} />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <MHidden width="mdUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: 280 } }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
      <MHidden width="mdDown">
        <Drawer variant="permanent" PaperProps={{ sx: { width: 280, position: 'relative' } }}>
          {renderContent}
        </Drawer>
      </MHidden>
    </>
  );
}
