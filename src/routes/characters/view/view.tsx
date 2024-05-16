import { Box, Container, Tab, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useLocalStorage } from "hooks/use-localstorage";
import { useParams } from "react-router-dom";
import { AppContext } from "hooks/appcontext";
import { useEffect, useContext } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { calculateCharacter } from "utils/data";
import { Description } from "./description";
import { Equipment } from "./equipment";
import { Notes } from "./notes";
import { Attributes } from "./attributes";
import { Abilities } from './abilities';

export default function Home() {
  let params = useParams();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const { setContextActions } = appContext;
  const theCharacterId = params.id ?? "";
  useEffect(() => {
    const contextActions = [
      {
        name: "Edit Character",
        icon: <EditIcon />,
        onClick: () => {
          navigate(`/character/${params.id}/edit`);
        },
      },
    ];
    setContextActions(contextActions);
    return () => {
      setContextActions([]);
    };
  }, [setContextActions, navigate, params.id]);
  const [characters, setCharacters] = useLocalStorage("characters", {});
  const setCharacter = (data: any) => {
    setCharacters({
      ...characters,
      [theCharacterId]: data,
    });
  };
  const theCharacter = characters[theCharacterId] || {};
  const calculatedCharacter = calculateCharacter(theCharacter);
  const [currentTab, setCurrentTab] = useState<any>(0);
  const TABS = {
    basic: {
      name: "Basic",
      tab: (
        <Attributes
          calculatedCharacter={calculatedCharacter}
          character={theCharacter}
          setCharacter={setCharacter}
        />
      ),
    },
    effects: {
      name: "Abilities",
      tab: <Abilities calculatedCharacter={calculatedCharacter} />,
    },
    equipment: {
      name: "Equipment",
      tab: <Equipment character={theCharacter} setCharacter={setCharacter} />,
    },
    description: {
      name: "Description",
      tab: <Description character={theCharacter} />,
    },
    notes: {
      name: "Notes",
      tab: <Notes character={theCharacter} setCharacter={setCharacter} />,
    },
  };
  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {theCharacter?.name}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
        <Tabs
          value={currentTab}
          onChange={(thing, value) => setCurrentTab(value)}
          variant="scrollable"
        >
          {Object.values(TABS).map((tab) => (
            <Tab
              sx={{ textTransform: "none" }}
              label={tab.name}
              key={tab.name}
            />
          ))}
        </Tabs>
      </Box>
      {Object.values(TABS)[currentTab]?.tab}
    </Container>
  );
}
