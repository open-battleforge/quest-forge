import { AppBar, Button, Container, LinearProgress, Toolbar, Typography, useTheme } from '@mui/material';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import introduction from 'assets/rules/1_introduction.md';
import characters from 'assets/rules/2_characters.md';
import attributes from 'assets/rules/3_attribute_tests.md';
import abilities from 'assets/rules/4_abilities_effects.md';
import equipmentrules from 'assets/rules/5_equipment.md';
import combat from 'assets/rules/6_combat.md';
import npcs from 'assets/rules/7_npcs_and_enemies.md';
import gameMaster from 'assets/rules/8_game_mastering.md';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { AppContext } from 'hooks/appcontext';

export const CHAPTERS: Record<string, any> = {
  introduction: {
    name: "Introduction",
    page: introduction
  },
  character_creation: {
    name: "Character Creation",
    page: characters
  },
  attribute_tests: {
    name: "Attribute Tests",
    page: attributes
  },
  abilities_and_effects: {
    name: "Abilities and Effects",
    page: abilities
  },
  items_and_equipment: {
    name: "Items and Equipment",
    page: equipmentrules
  },
  combat_and_actions: {
    name: "Combat and Actions",
    page: combat
  },
  npcs_and_enemies: {
    name: "NPCs and Enemies",
    page: npcs
  },
  game_mastering: {
    name: "Game Mastering",
    page: gameMaster
  }
};

export default function Rules() {
  const [postMarkdown, setPostMarkdown] = React.useState('');
  const theme = useTheme();
  const navigate = useNavigate();
  let params = useParams();
  const appContext = React.useContext(AppContext);
  const { setContextActions } = appContext;
  const scrollWithOffset = (smooth = true) => {
    window.scrollTo({ top: 0, behavior: (smooth ? 'smooth' : 'instant' as ScrollBehavior) });
  }
  React.useEffect(() => {
    const contextActions = [
      {
        name: 'View Character',
        icon: <ArrowUpIcon />,
        onClick: () => {
          scrollWithOffset()
        }
      }
    ];
    setContextActions(contextActions);
    return () => {
      setContextActions([]);
    }
  }, [ setContextActions ]);
  const page = params.page || 'introduction';
  const currentPage = CHAPTERS[page]?.page;
  const firstChapter = Object.keys(CHAPTERS)[0] || 'introduction';
  const currentPageNumber = Object.keys(CHAPTERS).indexOf(page);
  const totalPages = Object.keys(CHAPTERS).length;
  const nextPage = () => {
    const newPage = (currentPageNumber + 1) % totalPages;
    const nextPageId = Object.keys(CHAPTERS)[newPage];
    navigate(`/rules/${nextPageId}`);
    scrollWithOffset(false);
  };
  const previousPage = () => {
    const newPage = (currentPageNumber - 1) % totalPages;
    const nextPageId = Object.keys(CHAPTERS)[newPage];
    navigate(`/rules/${nextPageId}`);
    scrollWithOffset(false);
  };
  // useEffect with an empty dependency array (`[]`) runs only once
  React.useEffect(() => {
    fetch(currentPage)
      .then((response) => response.text())
      .then((text) => {
        setPostMarkdown(text);
      });
  }, [ currentPage ]);

  // Redirect back to the first page if the requested page is not found
  if (!currentPage) {
    return (
      <Navigate replace to={`/rules/${firstChapter}`} />
    );
  }

  const components = {
    h1({node, inline, className, children, ...props}: any) {
      return (
        <Typography sx={{ borderBottom: `5px solid ${theme.palette.primary.main}` }} variant="h1" fontSize="2em" className={className} {...props} gutterBottom>
          {children}
        </Typography>
      )
    },
    h2({node, inline, className, children, ...props}: any) {
      return (
        <Typography variant="h2" fontSize="1.8em" className={className} {...props} gutterBottom>
          {children}
        </Typography>
      )
    },
    h3({node, inline, className, children, ...props}: any) {
      return (
        <Typography variant="h3" fontSize="1.5em" className={className} {...props} gutterBottom>
          {children}
        </Typography>
      )
    },
    h4({node, inline, className, children, ...props}: any) {
      return (
        <Typography variant="h4" fontSize="1.3em" className={className} {...props} gutterBottom>
          {children}
        </Typography>
      )
    },
    p({node, inline, className, children, ...props}: any) {
      return (
        <Typography className={className} {...props} paragraph>
          {children}
        </Typography>
      )
    }
  }

  return (
    <>
      {!postMarkdown &&
        <LinearProgress sx={{ width: '100%' }} />
      }
      <Container sx={{ mt: 2 }}>
        <ReactMarkdown children={postMarkdown} remarkPlugins={[remarkGfm]} components={components} />
        <Toolbar />
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar sx={{ justifyContent: "end" }}>
            <Button sx={{ color: 'inherit' }} onClick={previousPage} disabled={currentPageNumber === 0}>
              Previous
            </Button>
            <Button sx={{ ml: 1, color: 'inherit' }} onClick={nextPage} disabled={currentPageNumber === totalPages - 1}>
              Next
            </Button>
          </Toolbar>
        </AppBar>
      </Container>
    </>
  );
};