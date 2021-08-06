import { useEffect } from "react";
import { useParams } from "react-router-dom";
// material
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { Box, Divider, Typography } from "@material-ui/core";
// redux
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { getMail } from "../../../redux/slices/mail";
// theme
import typography from "../../../theme/typography";
//
import Markdown from "../../Markdown";
import Scrollbar from "../../Scrollbar";

// ----------------------------------------------------------------------

const RootStyle = styled("div")({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
});

const MarkdownWrapperStyle = styled("div")(({ theme }) => ({
  "& > p": {
    ...typography.body1,
    marginBottom: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function ArtistDetails() {
  const { mailId = "" } = useParams();
  const dispatch = useDispatch();
  const mail = useSelector((state: RootState) => state.mail.mails.byId[mailId]);

  useEffect(() => {
    dispatch(getMail(mailId));
  }, [dispatch, mailId]);

  if (!mail) {
    return null;
  }

  return (
    <RootStyle>
      {/* <ArtistToolbar mail={mail} /> */}

      <Divider />

      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h3" gutterBottom>
            {mail.subject}
          </Typography>
          <MarkdownWrapperStyle>
            <Markdown children={mail.message} />
          </MarkdownWrapperStyle>
        </Box>
      </Scrollbar>
    </RootStyle>
  );
}
