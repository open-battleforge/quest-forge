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
import { Notes } from "./notes";
import { Attributes } from "./attributes";
import { Scenario } from "./scenarios";
import { NPCs } from "./locations";

export default function Home() {
  let params = useParams();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const { setContextActions } = appContext;
  const theCharacterId = params.id ?? "";
  useEffect(() => {
    const contextActions = [
      {
        name: "Edit Adventure",
        icon: <EditIcon />,
        onClick: () => {
          navigate(`/adventure/${params.id}/edit`);
        },
      },
    ];
    setContextActions(contextActions);
    return () => {
      setContextActions([]);
    };
  }, [setContextActions, navigate, params.id]);
  const [characters, setCharacters] = useLocalStorage("adventures", {});
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
    scenario: {
      name: "Scenario",
      tab: (
        <Scenario
          character={theCharacter}
          setCharacter={setCharacter}
        />
      ),
    },
    rooms: {
      name: "Locations",
      tab: (
        <NPCs
          character={theCharacter}
          setCharacter={setCharacter}
        />
      ),
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
