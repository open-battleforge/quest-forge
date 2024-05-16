import { Box, Card, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import { getStory } from "utils/data";
import Show from "components/show";

export const Attributes = (props: any) => {
  const { character } = props;
  const story = getStory(character?.story);
  const theme = useTheme();
  return (
    <>
      <Show when={!!story?.description}>
        <Card
          variant="outlined"
          sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }}
        >
          <Typography
            sx={{
              p: 1,
            }}
            variant="h6"
          >
            {story?.name}
          </Typography>
          <Box sx={{ p: 1 }}>
            <ReactMarkdown className="markdown" children={story?.description} />
          </Box>
        </Card>
      </Show>
    </>
  );
};
