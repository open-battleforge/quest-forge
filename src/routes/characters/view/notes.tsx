import {
  TextField,
} from "@mui/material";

export const Notes = (props: any) => {
  const { character, setCharacter } = props;
  return (
    <TextField
      size="small"
      rows={10}
      fullWidth
      label="Notes"
      multiline
      value={character?.notes}
      onChange={(event: any) => {
        setCharacter({
          ...character,
          notes: event?.target?.value,
        });
      }}
    />
  );
};