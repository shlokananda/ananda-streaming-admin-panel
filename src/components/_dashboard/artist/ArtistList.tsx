import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Divider, Box } from '@material-ui/core';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { getMails } from '../../../redux/slices/mail';
//
import Scrollbar from '../../Scrollbar';
import EmptyContent from '../../EmptyContent';
import ArtistItem from './ArtistItem';
import ArtistToolbar from './ArtistToolbar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column'
});

// ----------------------------------------------------------------------

type ArtistListProps = {
  onOpenSidebar: VoidFunction;
};

export default function ArtistList({ onOpenSidebar }: ArtistListProps) {
  const params = useParams();
  const dispatch = useDispatch();
  const { artists } = useSelector((state: RootState) => state.artist);
  const [selectedMails, setSelectedMails] = useState<string[]>([]);
  const [dense, setDense] = useState(false);
  const isEmpty = artists.allIds.length < 1;

  useEffect(() => {
    dispatch(getMails(params));
  }, [dispatch, params]);

  const handleSelectAllMails = () => {
    setSelectedMails(artists.allIds.map((mailId: any) => mailId));
  };

  const handleToggleDense = () => {
    setDense((prev) => !prev);
  };

  const handleDeselectAllMails = () => {
    setSelectedMails([]);
  };

  const handleSelectOneMail = (mailId: string) => {
    setSelectedMails((prevSelectedMails) => {
      if (!prevSelectedMails.includes(mailId)) {
        return [...prevSelectedMails, mailId];
      }
      return prevSelectedMails;
    });
  };

  const handleDeselectOneMail = (mailId: string) => {
    setSelectedMails((prevSelectedMails) => prevSelectedMails.filter((id) => id !== mailId));
  };

  return (
    <RootStyle>
      <ArtistToolbar
        artists={artists.allIds.length}
        selectedMails={selectedMails.length}
        onSelectAll={handleSelectAllMails}
        onOpenSidebar={onOpenSidebar}
        onDeselectAll={handleDeselectAllMails}
        onToggleDense={handleToggleDense}
      />

      <Divider />

      {!isEmpty ? (
        <Scrollbar>
          <Box sx={{ minWidth: { md: 800 } }}>
            {artists.allIds.map((mailId: any) => (
              <ArtistItem
                key={mailId}
                isDense={dense}
                artist={artists.byId[mailId]}
                isSelected={selectedMails.includes(mailId)}
                onSelect={() => handleSelectOneMail(mailId)}
                onDeselect={() => handleDeselectOneMail(mailId)}
              />
            ))}
          </Box>
        </Scrollbar>
      ) : (
        <EmptyContent
          title="No Songs Found by this artist."
          sx={{ flexGrow: 1, height: 'auto' }}
        />
      )}
    </RootStyle>
  );
}
