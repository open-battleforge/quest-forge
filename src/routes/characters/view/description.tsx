import {
  Box,
  Card,
  useTheme,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import Typography from "@mui/material/Typography";

export const Description = (props: any) => {
  const { character } = props;
  const theme = useTheme();
  return (
    <>
      {!!character.description && (
        <Card variant="outlined" sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }}>
          <Typography
            sx={{
              p: 1,
            }}
            variant="h6"
          >
            Description
          </Typography>
          <Box sx={{ p: 1 }}>
            <ReactMarkdown className="markdown" children={character.description} />
          </Box>
        </Card>
      )}
      {!!character.background && (
        <Card variant="outlined" sx={{ borderLeft: `5px solid ${theme.palette.primary.main}` }}>
          <Typography
            sx={{
              p: 1,
            }}
            variant="h6"
          >
            Background
          </Typography>
          <Box sx={{ p: 1 }}>
            <ReactMarkdown className="markdown" children={character.background} />
          </Box>
        </Card>
      )}
    </>
  );
};