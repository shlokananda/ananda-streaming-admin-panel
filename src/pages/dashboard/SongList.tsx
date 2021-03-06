import { filter } from "lodash";
import { useState, useEffect } from "react";
// Icons
import editFill from "@iconify/icons-eva/edit-fill";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import { Icon } from "@iconify/react";

// Graphql
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_TRACKS } from "../../queries/track";

// material
import { useTheme } from "@material-ui/core/styles";
import {
  Card,
  Checkbox,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@material-ui/core";
// redux
import { RootState, useDispatch, useSelector } from "../../redux/store";
import { deleteUser } from "../../redux/slices/user";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// @types
// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { UserListToolbar } from "../../components/_dashboard/user/list";
import { Song } from "../../@types/song";
import { getSongList } from "../../redux/slices/song";
import ListHead from "components/_dashboard/user/list/ListHead";
import ListToolbar from "components/_dashboard/user/list/ListToolbar";
import { secondsToHms } from "utils/timeFunctions";
import Player from "./Player";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "title", label: "Title", alignRight: false },
  { id: "duration", label: "Duration", alignRight: false },
  { id: "album", label: "Album", alignRight: false },
  { id: "artist", label: "Artist", alignRight: false },
  { id: "year", label: "Year", alignRight: true },
  { id: "_id", label: "Action", alignCenter: true },
  // { id: "genre", label: "Genre", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === "desc"
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: Song[],
  comparator: (a: any, b: any) => number,
  query: string
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      // (_song) => _song.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
      (_song) =>
        JSON.stringify(_song).toLowerCase().includes(query.toLowerCase())
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SongList() {
  const getAllSongListQuery = useQuery(GET_ALL_TRACKS);
  const theme = useTheme();
  const dispatch = useDispatch();
  const songList =
    getAllSongListQuery.data && getAllSongListQuery.data.mediaMany;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterAll, setFilterAll] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10); //5
  const [selectedFile, setSelectedFile] = useState(
    new Audio(
      "https://streaming-platform-test.s3.us-east-2.amazonaws.com/04%20Rubaiyat.mp3"
    )
  ); //5
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    dispatch(getSongList());
  }, [dispatch]);

  const playPause = (newFile?: any) => {
    if (newFile) {
      setSelectedFile(new Audio(newFile));
    }
    console.log(selectedFile, isPlaying);

    // Get state of song
    if (selectedFile) {
      if (isPlaying) {
        // Pause the song if it is playing
        selectedFile.pause();
        console.log("Pause");
      } else {
        // Play the song if it is paused
        selectedFile.play();
        console.log("Pause");
      }
    }
    // Change the state of song
    setIsPlaying(!isPlaying);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = songList.map((n: any) => n.title);
      console.log(songList);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByTitle = (filterTitle: string) => {
    setFilterTitle(filterTitle);
  };

  const handleFilterFreeText = (keyword: string) => {
    setFilterAll(keyword);
  };

  const handleDeleteUser = (userId: string) => {
    dispatch(deleteUser(userId));
  };

  const handleFileSelection = (rowData: any) => {
    console.log(rowData);
    const fileUrl = rowData.file.location;
    playPause(fileUrl);
  };
  const handlePlayPause = (playing: boolean) => {
    console.log(playing);
    setIsPlaying(playing);
    playPause();
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - songList.length) : 0;

  const filteredSongs = applySortFilter(
    songList || [],
    getComparator(order, orderBy),
    // filterTitle
    filterAll
  );

  const isSongNotFound = filteredSongs.length === 0;

  // Table Actions
  const handleEdit = (data: any) => {
    console.log(data);
  };

  return (
    <Page title="Songs | Ananda Streaming Platform">
      <Container>
        <HeaderBreadcrumbs
          heading="List of Songs"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Songs", href: PATH_DASHBOARD.song.root },
            { name: "All" },
          ]}
        />
        <Card>
          <ListToolbar
            isPlaying={isPlaying}
            title="song"
            numSelected={selected.length}
            filterName={filterAll}
            onFilterName={handleFilterFreeText}
            onPlayChange={handlePlayPause}
          />
          {/* <Player file={selectedFile} type="audio/mpeg" /> */}
          {/* // onFileChange="handleFileChange($event)" */}

          <Scrollbar>
            <TableContainer
              sx={{ minWidth: 800, height: "calc(100vh - 450px)" }}
            >
              <Table>
                <ListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={songList && songList?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredSongs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((song: any) => {
                      const {
                        _id,
                        title,
                        format,
                        artist,
                        album,
                        year,
                        genre,
                      } = song;
                      const isItemSelected = selected.indexOf(title) !== -1;
                      // console.log(song);
                      return (
                        <TableRow key={_id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onClick={() => handleClick(title)}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <span
                              className="link"
                              onClick={() => handleFileSelection(song)}
                            >
                              {title}
                            </span>
                          </TableCell>
                          <TableCell align="left">
                            {secondsToHms(format.duration.toFixed(2))}
                          </TableCell>
                          <TableCell align="left">{album}</TableCell>
                          <TableCell align="left">{artist}</TableCell>
                          <TableCell align="right">{year}</TableCell>
                          {/* Actions */}
                          <TableCell>
                            <IconButton onClick={() => handleEdit(song)}>
                              <Icon icon={editFill} width={24} height={24} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={songList?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
