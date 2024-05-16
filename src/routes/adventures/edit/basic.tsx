import {
  Box, Stack, TextField,
  Button} from "@mui/material";
import { useModal } from "hooks/use-modal";
import { getStories } from "utils/data";
import { ChooseAdventure } from "../modals";

type props = {
  character: any,
  setCharacter: Function
};

export default function Home(props: props) {
  const { character, setCharacter } = props;
  const stories: Record<string, any> = getStories();
  const handleSelectStory = (story: string) => {
    setCharacter({
      ...character,
      story
    });
  };
  const [showSelectAdventure, hideSelectAdventure] = useModal(
    () => (
      <ChooseAdventure
        hideModal={hideSelectAdventure}
        stories={stories}
        selectStory={handleSelectStory}
        character={character}
      />
    ),
    [ character ]
  );
  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <TextField
          size="small"
          label="Name"
          variant="outlined"
          value={character.name}
          onChange={((event) => {
            setCharacter({
              ...character,
              name: event?.target?.value
            });
          })}
        />
        <Button variant="outlined" onClick={() => showSelectAdventure()}>{stories[character?.story]?.name || 'Choose Story'}</Button>
      </Stack>
    </Box>
  );
};