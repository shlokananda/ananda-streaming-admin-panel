import { Icon } from '@iconify/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import starFill from '@iconify/icons-eva/star-fill';
import starOutline from '@iconify/icons-eva/star-outline';
import roundLabelImportant from '@iconify/icons-ic/round-label-important';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Link, Tooltip, Typography } from '@material-ui/core';
// redux
import { RootState, useSelector } from '../../../redux/store';
// utils
import { fDate } from '../../../utils/formatTime';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Artist } from '../../../@types/artist';
//
import { MCheckbox, MHidden } from '../../@material-extend';
import Label from '../../Label';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: { display: 'flex', alignItems: 'center' },
  '&:hover': {
    zIndex: 999,
    position: 'relative',
    boxShadow: theme.customShadows.z24,
    '& .showActions': { opacity: 1 }
  }
}));

const WrapStyle = styled(Link)(({ theme }) => ({
  minWidth: 0,
  display: 'flex',
  padding: theme.spacing(2, 0),
  transition: theme.transitions.create('padding')
}));

// ----------------------------------------------------------------------

const linkTo = (params: { systemLabel?: string; customLabel?: string }, mailId: string) => {
  const { systemLabel, customLabel } = params;
  const baseUrl = PATH_DASHBOARD.artist.root;

  if (systemLabel) {
    return `${baseUrl}/${systemLabel}/${mailId}`;
  }
  if (customLabel) {
    return `${baseUrl}/label/${customLabel}/${mailId}`;
  }
  return baseUrl;
};

type ArtistItemProps = {
  artist: Artist;
  isDense: boolean;
  isSelected: boolean;
  onDeselect: VoidFunction;
  onSelect: VoidFunction;
};

export default function ArtistItem({
  artist,
  isDense,
  isSelected,
  onSelect,
  onDeselect,
  ...other
}: ArtistItemProps) {
  const params = useParams();
  const { labels } = useSelector((state: RootState) => state.artist);

  const handleChangeCheckbox = (checked: boolean) => (checked ? onSelect() : onDeselect());

  return (
    <RootStyle
      sx={{
        ...(!artist.isUnread && {
          color: 'text.primary',
          backgroundColor: 'background.paper'
        }),
        ...(isSelected && { bgcolor: 'action.selected' })
      }}
      {...other}
    >
      <MHidden width="mdDown">
        <Box sx={{ mr: 2, display: 'flex' }}>
          <MCheckbox
            checked={isSelected}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeCheckbox(event.target.checked)
            }
          />
          <Tooltip title="Starred">
            <MCheckbox
              color="warning"
              defaultChecked={artist.isStarred}
              icon={<Icon icon={starOutline} />}
              checkedIcon={<Icon icon={starFill} />}
            />
          </Tooltip>
          <Tooltip title="Important">
            <MCheckbox
              color="warning"
              defaultChecked={artist.isImportant}
              checkedIcon={<Icon icon={roundLabelImportant} />}
              icon={<Icon icon={roundLabelImportant} />}
            />
          </Tooltip>
        </Box>
      </MHidden>

      <WrapStyle
        color="inherit"
        underline="none"
        // @ts-ignore
        component={RouterLink}
        to={linkTo(params, artist.id)}
        sx={{ ...(isDense && { py: 1 }) }}
      >
        <Box
          sx={{
            ml: 2,
            minWidth: 0,
            alignItems: 'center',
            display: { md: 'flex' }
          }}
        >
          <Typography
            noWrap
            variant="body2"
            sx={{
              pr: 2
            }}
          >
            <Box
              component="span"
              sx={{ ...(!artist.isUnread && { fontWeight: 'fontWeightBold' }) }}
            >
              {artist.subject}
            </Box>
            &nbsp;-&nbsp;
            <Box
              component="span"
              sx={{
                ...(!artist.isUnread && { color: 'text.secondary' })
              }}
            >
              {artist.message}
            </Box>
          </Typography>

          <MHidden width="mdDown">
            <Box sx={{ display: 'flex' }}>
              {artist.labelIds.map((labelId) => {
                const label = labels.find((_label) => _label.id === labelId);
                if (!label) return null;
                return (
                  <Label
                    key={label.id}
                    sx={{
                      mx: 0.5,
                      textTransform: 'capitalize',
                      bgcolor: label.color,
                      color: (theme) => theme.palette.getContrastText(label.color || '')
                    }}
                  >
                    {label.name}
                  </Label>
                );
              })}
            </Box>
          </MHidden>

          <Typography
            variant="caption"
            sx={{
              flexShrink: 0,
              minWidth: 120,
              textAlign: 'right',
              ...(!artist.isUnread && { fontWeight: 'fontWeightBold' })
            }}
          >
            {fDate(artist.createdAt)}
          </Typography>
        </Box>
      </WrapStyle>
    </RootStyle>
  );
}
