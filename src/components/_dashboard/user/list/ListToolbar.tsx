import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-fill";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
import roundPlayCircleFilled from "@iconify/icons-ic/round-play-circle-filled";
import roundPauseCircleFilled from "@iconify/icons-ic/round-pause-circle-filled";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
// material
import {
  useTheme,
  experimentalStyled as styled,
} from "@material-ui/core/styles";
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

type ListToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (value: string) => void;
  title: string;
  isPlaying: boolean;
  onPlayChange: (value: any) => void;
};

export default function ListToolbar({
  numSelected,
  filterName,
  onFilterName,
  title,
  isPlaying,
  onPlayChange,
}: ListToolbarProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? "primary.main" : "text.primary",
          bgcolor: isLight ? "primary.lighter" : "primary.dark",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={(e) => onFilterName(e.target.value)}
          placeholder={`Search ${title}...`}
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: "text.disabled" }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={`${isPlaying ? "Pause" : "Play"}`}>
          <IconButton onClick={() => onPlayChange(isPlaying)}>
            <Icon
              icon={isPlaying ? roundPauseCircleFilled : roundPlayCircleFilled}
            />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
