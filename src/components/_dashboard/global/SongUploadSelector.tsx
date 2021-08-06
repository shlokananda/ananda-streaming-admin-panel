import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import expandFill from "@iconify/icons-eva/expand-fill";
import folderAddFill from "@iconify/icons-eva/folder-add-fill";
import fileAddFill from "@iconify/icons-eva/file-add-fill";
import collapseFill from "@iconify/icons-eva/collapse-fill";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";

// material
import {
  useTheme,
  experimentalStyled as styled,
} from "@material-ui/core/styles";
import {
  Box,
  Input,
  Portal,
  Button,
  Backdrop,
  IconButton,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
//

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  left: 0,
  bottom: 0,
  zIndex: 1999,
  minHeight: 440,
  width: 500,
  outline: "none",
  display: "flex",
  position: "fixed",
  overflow: "hidden",
  justifyContent: "space-between",
  flexDirection: "column",
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z24,
  borderRadius: theme.shape.borderRadiusMd,
  border: "1px solid #e0e0e0",
  backgroundColor: theme.palette.background.paper,
}));

const InputStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),
  borderBottom: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

type SongUploadProps = {
  isUploaderOpen: boolean;
  onCloseUploader: VoidFunction;
};

export default function SongUploadSelector({
  isUploaderOpen,
  onCloseUploader,
}: SongUploadProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);

  const handleExitFullScreen = () => {
    setFullScreen(false);
  };

  const handleEnterFullScreen = () => {
    setFullScreen(true);
  };

  const handleClose = () => {
    onCloseUploader();
    setFullScreen(false);
  };

  const handleUpload = () => {
    // Hit Upload API
    const apiExt: string = `media/upload`;
    const url: string = `http://localhost:8080/${apiExt}`;

    // Setup FormData
    const formData = new FormData();
    console.log(selectedFiles);

    // for (let index = 0; index < selectedFiles.length; index++) {
    const file = selectedFiles[0];
    formData.append("songs", file);
    console.log(formData);
    // }

    // Start Loader (Progress)
    setLoading(true);
    // API Call
    axios.post(url, formData).then((result) => {
      console.log(result);
      if (result.status == 200) {
        clearAfterUpload();
      } else {
        setLoading(false);
      }
    });
  };

  let folderInput: any; // Ref for Folder Select
  let fileInput: any; // Ref for File Select

  const clearAfterUpload = () => {
    setSelectedFiles([]); // Clear Selected Files
    setLoading(false);
  };

  const readFile = (event: any) => {
    console.log(event);
    const fileList: any[] = event.target.files;
    const loadedFiles = [];
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];
      // Upload Only Audio Files
      if (element.type.includes("audio")) loadedFiles.push(element);
    }
    setSelectedFiles(loadedFiles);
  };

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  if (!isUploaderOpen) {
    return null;
  }

  return (
    <Portal>
      <Backdrop open={fullScreen || isMobile} sx={{ zIndex: 1998 }} />
      <RootStyle
        sx={{
          ...(isMobile && {
            width: 350,
          }),
          ...(fullScreen && {
            top: 0,
            left: 40,
            zIndex: 1999,
            margin: "auto",
            width: {
              xs: `calc(100% - 24px)`,
              md: `calc(100% - 80px)`,
            },
            height: {
              xs: `calc(100% - 24px)`,
              md: `calc(100% - 80px)`,
            },
          }),
        }}
      >
        <Box
          sx={{
            pl: 3,
            pr: 1,
            height: 60,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6">Upload Song</Typography>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={fullScreen ? handleExitFullScreen : handleEnterFullScreen}
          >
            <Icon
              icon={fullScreen ? collapseFill : expandFill}
              width={20}
              height={20}
            />
          </IconButton>

          <IconButton onClick={handleClose}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Box>

        <Box sx={{ ...(selectedFiles.length > 0 && { height: "100%" }) }}>
          {/* Files Selector */}
          <Box
            sx={{
              px: 2,
              width: "100%",
              height: 100,
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => folderInput.click()}
              startIcon={<Icon icon={folderAddFill} />}
            >
              Select Folder
            </Button>
            OR
            <Button variant="outlined" startIcon={<Icon icon={fileAddFill} />}>
              Select Files
            </Button>
            {/* Hidden Inputs */}
            <input
              accept="audio/mp3,audio/*"
              onChange={(event) => {
                readFile(event);
              }}
              type="file"
              name="songs"
              directory=""
              webkitdirectory=""
              style={{ display: "None" }}
              ref={(input) => (folderInput = input)}
            />
            <input
              accept=".audio/mp3,audio/*"
              multiple
              onChange={(event) => {
                readFile(event);
              }}
              type="file"
              style={{ display: "None" }}
              ref={(input) => (fileInput = input)}
            />
          </Box>

          {/* Selected File List */}
          {selectedFiles.length > 0 && (
            <Box
              sx={{
                padding: "20px 24px",
                minHeight: 216,
                maxHeight: "calc(100vh - 292px)",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <ol style={{ paddingLeft: "20px" }}>
                {selectedFiles.map((file: any) => {
                  return (
                    <li
                      key={file.name}
                      style={{
                        paddingBottom: "15px",
                      }}
                    >
                      {file.name}
                    </li>
                  );
                })}
              </ol>
            </Box>
          )}
        </Box>

        {/* Upload Progress  */}
        <>{loading && <LinearProgress color="success" />}</>
        {/* Upload Progress End */}
        <Box
          sx={{
            py: 2,
            px: 3,
            display: "flex",
            height: 60,
            alignItems: "center",
            justifyContent: "flex-end",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button variant="contained" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading.." : "Upload"}
          </Button>
        </Box>
      </RootStyle>
    </Portal>
  );
}

// Extend HTML Tag to support direcotry option on Input Tag
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string; // remember to make these attributes optional....
    webkitdirectory?: string;
  }
}
