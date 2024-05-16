import {
  Box, Stack, TextField
} from "@mui/material";

type props = {
  character: any,
  setCharacter: Function
};

export default function Description(props: props) {
  const { character, setCharacter } = props;
  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <TextField
          size="small"
          rows={4}
          fullWidth
          label="Description"
          multiline
          value={character.description}
          onChange={((event) => {
            setCharacter({
              ...character,
              description: event?.target?.value
            });
          })}
        />
        <TextField
          size="small"
          rows={8}
          fullWidth
          label="Background"
          multiline
          value={character.background}
          onChange={((event) => {
            setCharacter({
              ...character,
              background: event?.target?.value
            });
          })}
        />
      </Stack>
    </Box>
  );
};