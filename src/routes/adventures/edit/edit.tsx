import { AppBar, Box, Button, Container, Tab, Tabs, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { AppContext } from 'hooks/appcontext';
import { useLocalStorage } from 'hooks/use-localstorage';
import React from 'react';
import { useParams } from "react-router-dom";
import Basic from './basic';
import ViewIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  let params = useParams();
  const navigate = useNavigate();
  const appContext = React.useContext(AppContext);
  const { setContextActions } = appContext;
  const theCharacterId = params.id ?? '';
  React.useEffect(() => {
    const contextActions = [
      {
        name: 'View Character',
        icon: <ViewIcon />,
        onClick: () => {
          navigate(`/adventure/${params.id}/view`);
        }
      }
    ];
    setContextActions(contextActions);
    return () => {
      setContextActions([]);
    }
  }, [ setContextActions, navigate, params.id ]);
  const [characters, setCharacters] = useLocalStorage("adventures", {});
  const setCharacter = (data: any) => {
    setCharacters({
      ...characters,
      [theCharacterId]: data
    });
  }
  const theCharacter = characters[theCharacterId] || {};
  const [currentTab, setCurrentTab] = React.useState<any>(0);
  const TABS = {
    basic: {
      name: "Basic",
      tab: <Basic character={theCharacter} setCharacter={setCharacter} />
    }
  };
  const navigateToView = () => {
    navigate(`/adventure/${params.id}/view`);
  }
  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Adventure Editor
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={(thing, value) => setCurrentTab(value)} variant="scrollable">
          {Object.values(TABS).map((tab) => (
            <Tab sx={{ textTransform: "none" }} label={tab.name} key={tab.name} />
          ))}
        </Tabs>
      </Box>
      {Object.values(TABS)[currentTab]?.tab}
      <Toolbar />
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar sx={{ justifyContent: "end" }}>
          <Button sx={{ color: 'inherit' }} onClick={() => setCurrentTab(currentTab - 1)} disabled={currentTab === 0}>
            Previous
          </Button>
          <Button sx={{ ml: 1, color: 'inherit' }} onClick={() => currentTab === Object.values(TABS).length - 1 ? navigateToView() : setCurrentTab(currentTab + 1)} disabled={currentTab === (Object.values(TABS).length)}>
            {currentTab === Object.values(TABS).length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Toolbar>
      </AppBar>
    </Container>
  );
};