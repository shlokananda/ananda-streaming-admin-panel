import { useState } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import expandFill from '@iconify/icons-eva/expand-fill';
import folderAddFill from '@iconify/icons-eva/folder-add-fill';
import fileAddFill from '@iconify/icons-eva/file-add-fill';
import collapseFill from '@iconify/icons-eva/collapse-fill';

// material
import { useTheme, experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Input,
  Portal,
  Button,
  Divider,
  Backdrop,
  IconButton,
  Typography,
  useMediaQuery
} from '@material-ui/core';
//
import { QuillEditor } from '../../editor';
import React from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  left: 0,
  bottom: 0,
  zIndex: 1999,
  minHeight: 440,
  width: 500,
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  overflow: 'hidden',
  justifyContent: "space-between",
  flexDirection: 'column',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z24,
  borderRadius: theme.shape.borderRadiusMd,
  border: "1px solid #e0e0e0",
  backgroundColor: theme.palette.background.paper
}));

const InputStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),
  borderBottom: `solid 1px ${theme.palette.divider}`
}));

// ----------------------------------------------------------------------

type SongUploadProps = {
  isUploaderOpen: boolean;
  onCloseUploader: VoidFunction;
};

export default function SongUploadSelector({ isUploaderOpen, onCloseUploader }: SongUploadProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);

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

  let folderInput: any; // Ref for Folder Select
  let fileInput: any; // Ref for File Select

  const readFile = (event: any) => {
    const fileList: any[] = event.target.files;
    const loadedFiles = []
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];
      loadedFiles.push(element)
    }
    setSelectedFiles(loadedFiles)
  }

  if (!isUploaderOpen) {
    return null;
  }

  return (
    <Portal>
      <Backdrop open={fullScreen || isMobile} sx={{ zIndex: 1998 }} />
      <RootStyle
        sx={{
          ...(isMobile && {
            width: 350
          }),
          ...(fullScreen && {
            top: 0,
            left: 40,
            zIndex: 1999,
            margin: 'auto',
            width: {
              xs: `calc(100% - 24px)`,
              md: `calc(100% - 80px)`
            },
            height: {
              xs: `calc(100% - 24px)`,
              md: `calc(100% - 80px)`
            }
          })
        }}
      >
        <Box
          sx={{
            pl: 3,
            pr: 1,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            borderBottom: "1px solid #e0e0e0"
          }}
        >
          <Typography variant="h6">Upload Song</Typography>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton onClick={fullScreen ? handleExitFullScreen : handleEnterFullScreen}>
            <Icon icon={fullScreen ? collapseFill : expandFill} width={20} height={20} />
          </IconButton>

          <IconButton onClick={handleClose}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Box>

        <Box sx={{...(selectedFiles.length > 0 && { height: "100%"})}}>
          {/* Files Selector */}
          <Box sx={{
              px: 2,
              width: "100%",
              height: 100,
              display: 'flex',
              justifyContent: "space-evenly",
              alignItems: 'center'
            }}> 
            <Button
              variant="outlined"
              onClick={() => folderInput.click()}
              startIcon={<Icon icon={folderAddFill} />}>
              Select Folder
            </Button>
            OR 
            <Button
              variant="outlined"
              startIcon={<Icon icon={fileAddFill} />}>
              Select Files
            </Button> 
            {/* Hidden Inputs */}
            <input accept="audio/mp3,audio/*" onChange={(event)=> { readFile(event) }} type="file" directory=""
                webkitdirectory="" style={{ display: "None" }} ref={input => folderInput = input}/>
            <input accept=".audio/mp3,audio/*" multiple onChange={(event)=> { readFile(event) }} type="file"
               style={{ display: "None" }} ref={input => fileInput = input}/>
          </Box>

          {/* Selected File List */}
            { selectedFiles.length > 0 && (
              <Box sx={{ minHeight: 216, maxHeight: "calc(100vh - 292px)", borderTop: "1px solid #e0e0e0" }}>
                { selectedFiles.map((file:any) => {
                  return (
                    <p key={file.name}>{file.name}</p>
                  )
                }) }
              </Box>
            ) }
        </Box>

        <Box sx={{ py: 2, px: 3, display: 'flex', height: 60, alignItems: 'center', justifyContent: "flex-end", borderTop: "1px solid #e0e0e0" }}>
          <Button variant="contained">Upload</Button>
        </Box>
      </RootStyle>
    </Portal>
  );
}


// Extend HTML Tag to support direcotry option on Input Tag
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;        // remember to make these attributes optional....
    webkitdirectory?: string;
  }
}
