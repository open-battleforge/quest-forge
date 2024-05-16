import {
  Box, Stack, TextField,
  Button,
  LinearProgress,
  Typography
} from "@mui/material";
import { useModal } from "hooks/use-modal";
import { getRaces, getClasses } from "utils/data";
import { ChooseClass, ChooseRace } from "../modals";

type props = {
  character: any,
  setCharacter: Function
};

export default function Home(props: props) {
  const { character, setCharacter } = props;
  const races: Record<string, any> = getRaces();
  const classes: Record<string, any> = getClasses();
  const unitExperience = character.experience || 0;
  const expPerLevel = 10;
  const levelProgress = unitExperience % expPerLevel;
  const levelProgressPercent = levelProgress / expPerLevel;
  const unitLevel = Math.floor((character.experience || 0) / expPerLevel) + 1;
  const formattedLevel = unitLevel;
  const maxLevel = 10;
  const isMaxLevel = unitExperience === maxLevel * expPerLevel;
  const handleSelectRace = (race: string) => {
    setCharacter({
      ...character,
      race
    });
  };
  const handleSelectClass = (classId: string) => {
    setCharacter({
      ...character,
      class: classId,
      attributes: {
        ...character?.attributes,
        ...classes[classId]?.attributes
      },
      perks: []
    });
  };
  const [showSelectRace, hideSelectRace] = useModal(
    () => (
      <ChooseRace
        hideModal={hideSelectRace}
        races={races}
        selectRace={handleSelectRace}
        character={character}
      />
    ),
    [ character ]
  );
  const [showSelectClass, hideSelectClass] = useModal(
    () => (
      <ChooseClass
        hideModal={hideSelectClass}
        classes={classes}
        selectClass={handleSelectClass}
        character={character}
      />
    ),
    [ character ]
  );
  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <div>
          <Typography variant="h5" sx={{ pb: 1 }} gutterBottom>
            Level {formattedLevel}
          </Typography>
          <Stack sx={{ mb: 1 }} direction="row" alignItems="center">
            <LinearProgress
              variant="determinate"
              style={{ height: "1em", flex: 1 }}
              value={levelProgressPercent * 100}
            />
            <Typography sx={{ ml: 2 }}>
              {levelProgressPercent * expPerLevel} / {expPerLevel} xp
            </Typography>
          </Stack>
          <Stack direction="row" flexWrap="wrap">
            <Button
              disabled={character.experience - 5 < 0}
              variant="contained"
              sx={{ mr: 1, py: 1, my: 1 }}
              size="small"
              color="primary"
              onClick={() => setCharacter({ ...character, experience: (character?.experience || 0) - 5 })}
            >
              {"-5 xp"}
            </Button>
            <Button
              disabled={character.experience - 1 < 0}
              variant="contained"
              sx={{ mr: 1, py: 1, my: 1 }}
              size="small"
              color="primary"
              onClick={() => setCharacter({ ...character, experience: (character.experience || 0) - 1 })}
            >
              {"-1 xp"}
            </Button>
            <Button
              disabled={isMaxLevel}
              variant="contained"
              sx={{ mr: 1, py: 1, my: 1 }}
              size="small"
              color="primary"
              onClick={() => setCharacter({ ...character, experience: (character.experience || 0) + 1 })}
            >
              {"+1 xp"}
            </Button>
            <Button
              disabled={isMaxLevel}
              variant="contained"
              sx={{ mr: 1, py: 1, my: 1 }}
              size="small"
              color="primary"
              onClick={() => setCharacter({ ...character, experience: (character.experience || 0) + 5 })}
            >
              {"+5 xp"}
            </Button>
          </Stack>
        </div>
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
        <Button variant="outlined" onClick={() => showSelectRace()}>{races[character?.race]?.name || 'Choose Race'}</Button>
        <Button variant="outlined" onClick={() => showSelectClass()}>{classes[character?.class]?.name || 'Choose Class'}</Button>
      </Stack>
    </Box>
  );
};