import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  Card,
  useTheme
} from "@mui/material";
import { Dropdown } from "components/dropdown";
import { RuleView } from "components/views/rules";
import React from "react";
import { getPerkCategories } from "utils/data";

type Props = {
  character: any;
  setCharacter: Function;
};

export default function Feats(props: Props) {
  const { character, setCharacter } = props;
  const [searchText, setSearchText] = React.useState("");
  const theme = useTheme();
  // const [showAll, setShowAll] = React.useState(false);
  const characterClass = character?.class || '';
  const characterAbilities = new Set(character?.perks);
  const perkCategories = getPerkCategories(characterClass);
  const renderPerkCategory = (props: any) => {
    const { perks } = props;
    return perks?.map((boon: any, index: number) => {
      return (
        <ListItem
          key={index}
          sx={{ p: 0 }}
          secondaryAction={
            <Checkbox
              sx={{ mr: -1 }}
              checked={characterAbilities.has(boon)}
              onChange={(event, value) => {
                value
                  ? characterAbilities.add(boon)
                  : characterAbilities.delete(boon);
                setCharacter({
                  ...character,
                  perks: Array.from(characterAbilities),
                });
              }}
            />
          }
        >
          <ListItemButton
            sx={{ pb: 0 }}
            onClick={() => {
              characterAbilities.has(boon)
                ? characterAbilities.delete(boon)
                : characterAbilities.add(boon);
              setCharacter({
                ...character,
                perks: Array.from(characterAbilities),
              });
            }}
          >
            <ListItemText primary={<RuleView perks={[boon]} />}/>
          </ListItemButton>
        </ListItem>
      );
    });
  };
  return (
    <Box sx={{ mt: 2 }}>
      {/* <FormControlLabel
        control={
          <Switch value={showAll} onChange={() => setShowAll(!showAll)} />
        }
        label="Show All"
      /> */}
      <TextField
        fullWidth
        size="small"
        label="Search"
        variant="outlined"
        sx={{ mb: 1 }}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      {Object.values(perkCategories)?.map((category: any, index: number) => {
        return (
          <Card variant="outlined" sx={{ mb: 1 }} key={index}>
            <Dropdown>
              {({ handleClose, open, handleOpen }: any) => (
                <>
                  <ListItemButton
                    sx={{ borderLeft: `5px solid ${theme.palette.primary.main}`, pl: 1.5 }}
                    onClick={() => (open ? handleClose() : handleOpen())}
                  >
                    <ListItemText
                      primary={<Typography variant="h6">{category?.name}</Typography>}
                    />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    {renderPerkCategory({ perks: category?.perks })}
                  </Collapse>
                </>
              )}
            </Dropdown>
          </Card>
        );
      })}
    </Box>
  );
}
