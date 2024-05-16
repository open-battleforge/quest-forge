import CloseIcon from '@mui/icons-material/Close';
import { Box, createTheme, IconButton, PaletteMode, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { MainAppBar } from 'components/app-bar';
import { Appdrawer } from 'components/app-drawer';
import { AppContext } from 'hooks/appcontext';
import { useLocalStorage } from 'hooks/use-localstorage';
import { ModalProvider } from 'hooks/use-modal';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import {
  Navigate, Route, Routes, useParams
} from "react-router-dom";
import {
  Attributes, CharacterEditor, Characters, Equipment,
  Equipments, Feat, Feats, Home, Rules, Rule, AdventureEditor,
  AdventureViewer,
  Settings,
  Beastiary,
  Beast,
  Adventures,
  CharacterViewer
} from 'routes';
import { CHAPTERS } from 'routes/rules/rules';
import { BASE_THEME } from 'utils/constants';
import './App.css';
import { Footer } from 'components/footer';

function App() {
  const [userPrefs, setUserPrefs] = useLocalStorage("userPrefs", {});
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [appTheme, setAppTheme] = React.useState<PaletteMode | undefined>('dark');
  const [contextActions, setContextActions] = React.useState<Array<any>>([]);
  const [enableSearch, setEnableSearch] = React.useState<boolean>(false);
  const [searchMode, setSearchMode] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');
  const setSearchEnabled = React.useCallback((enabled: boolean) => {
    setEnableSearch(enabled);
    if (!enabled) {
      setSearchText('');
      setSearchMode(false);
    }
  }, []);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up("md"));
  const appContextValue = {
    drawerOpen,
    setDrawerOpen,
    appTheme,
    setAppTheme,
    contextActions,
    setContextActions,
    enableSearch,
    setEnableSearch: setSearchEnabled,
    searchText,
    setSearchText,
    searchMode,
    setSearchMode,
    userPrefs,
    setUserPrefs
  };
  const notistackRef = React.createRef<any>();
  const onClickDismiss = (key: number) => () => {
    if (notistackRef && notistackRef.current) {
      notistackRef.current.closeSnackbar(key);
    }
  }
  const userTheme = userPrefs?.theme;
  const themeId = (!userTheme || userTheme === 'system') ? 'dark' : userTheme;
  const customTheme = createTheme({
    ...BASE_THEME,
    palette: {
      mode: themeId,
      primary: { main: '#009069' },
      secondary: { main: '#009069' }
    },
    typography: {
      fontSize: 12,
      fontFamily: 'Noto Sans JP',
      h1: {
        fontSize: '4rem',
        fontWeight: 'bold'
      },
      h2: {
        fontSize: '3rem',
        fontWeight: 'bold'
      },
      h3: {
        fontSize: '2.5rem',
        fontWeight: 'bold'
      },
      h4: {
        fontSize: '2rem',
        fontWeight: 'bold'
      },
      h5: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
      },
      h6: {
        fontSize: '1rem',
      }
    },
  });
  const firstChapter = Object.keys(CHAPTERS)[0] || 'introduction';
  const CharacterRedirect = () => {
    const { id } = useParams();
    return <Navigate replace to={`/character/${id}/view`} />
  }
  const AdventureRedirect = () => {
    const { id } = useParams();
    return <Navigate replace to={`/adventure/${id}/view`} />
  }
  return (
    <div>
      <ThemeProvider theme={customTheme}>
        <SnackbarProvider
          ref={notistackRef}
          maxSnack={3}
          action={(key: number) => (
            <IconButton sx={{ color: 'inherit' }} onClick={onClickDismiss(key)}>
              <CloseIcon />
            </IconButton>
          )}
        >
          <ModalProvider>
            <AppContext.Provider value={appContextValue}>
              <CssBaseline />
              <MainAppBar />
              <Box sx={{ ml: fullScreen ? '300px' : '0', mb: 2 }}>
                <Appdrawer />
                <Routes>
                  <Route path="settings" element={<Settings />} />
                  <Route path="rules" element={<Navigate replace to={`/rules/${firstChapter}`} />} />
                  <Route path="rules/:page" element={<Rules />} />
                  <Route path="rule/:id" element={<Rule />} />
                  <Route path="adventures" element={<Adventures />} />
                  <Route path="adventure/:id/view" element={<AdventureViewer />} />
                  <Route path="adventure/:id/edit" element={<AdventureEditor />} />
                  <Route path="adventure/:id" element={<AdventureRedirect />} />
                  <Route path="characters" element={<Characters />} />
                  <Route path="character/:id/view" element={<CharacterViewer />} />
                  <Route path="character/:id/edit" element={<CharacterEditor />} />
                  <Route path="character/:id" element={<CharacterRedirect />} />
                  <Route path="attributes" element={<Attributes />} />
                  <Route path="items" element={<Equipments />} />
                  <Route path="item/:id" element={<Equipment />} />
                  <Route path="classes" element={<Feats />} />
                  <Route path="class/:id" element={<Feat />} />
                  <Route path="beastiary" element={<Beastiary />} />
                  <Route path="beast/:id" element={<Beast />} />
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
                <Footer />
              </Box>
            </AppContext.Provider>
          </ModalProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
