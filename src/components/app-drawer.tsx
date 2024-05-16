import { ExpandLess, ExpandMore } from '@mui/icons-material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import StraightenIcon from '@mui/icons-material/Straighten';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GitHubIcon from '@mui/icons-material/GitHub';
import PetsIcon from '@mui/icons-material/Pets';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import { Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from "@mui/material/useMediaQuery";
import { AppContext } from 'hooks/appcontext';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from './dropdown';
import { CHAPTERS } from 'routes/rules/rules';
import DiscordIcon from 'mdi-material-ui/Discord';
import CoffeeIcon from 'mdi-material-ui/CoffeeOutline';

type NavItem = {
  id: string,
  name?: string,
  icon?: any,
  to?: string,
  toAbs?: string,
  children?: Array<NavItem>,
  onClick?: Function
}

export function Appdrawer() {
  const appContext = React.useContext(AppContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = 350;
  const navItems: Array<NavItem> = [
    {
      id: 'rules',
      name: 'Rules',
      icon: <StraightenIcon />,
      children: [
        ...(Object.keys(CHAPTERS).map((key, index) => (
          {
            id: key,
            name: `${index + 1}. ${CHAPTERS[key].name}`,
            icon: <BookmarkIcon />,
            to: `/rules/${key}`
          }
        )))
      ]
    },
    {
      id: 'catalogue',
      name: 'Catalogue',
      icon: <MenuBookIcon />,
      children: [
        {
          id: 'equipment',
          name: 'Equipment',
          icon: <VpnKeyIcon />,
          to: '/items'
        },
        {
          id: 'classes',
          name: 'Classes',
          icon: <EmojiEventsIcon />,
          to: '/classes'
        },
        {
          id: 'beastiary',
          name: 'Beastiary',
          icon: <PetsIcon />,
          to: '/beastiary'
        }
      ]
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: <ConstructionIcon />,
      children: [
        {
          id: 'adventures',
          name: 'Adventures',
          icon: <MapIcon />,
          to: '/adventures'
        },
        {
          id: 'characters',
          name: 'Characters',
          icon: <PersonIcon />,
          to: '/characters'
        },
        {
          id: 'editor',
          name: 'Data Editor',
          icon: <EditIcon />,
          to: '/editor'
        }
      ]
    },
    {
      id: 'divider'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <GitHubIcon />,
      toAbs: 'https://github.com/wargame-engine/quest-forge'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: <DiscordIcon />,
      toAbs: 'https://discord.com/invite/M9sets4'
    },
    {
      id: 'donate',
      name: 'Donate',
      icon: <CoffeeIcon />,
      toAbs: 'https://ko-fi.com/diceguild'
    },
    {
      id: 'divider'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <SettingsIcon />,
      to: '/settings'
    }
  ];
  const renderMenuItem = (item: NavItem, index: number) => {
    if (item.id === 'divider') {
      return <Divider key={index} />;
    }
    if (item.children) {
      return (
        <Dropdown key={index}>
          {({ handleClose, open, handleOpen, anchorElement }: any) => (
            <>
              <ListItemButton onClick={() => open ? handleClose() : handleOpen()}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={
                  <Typography style={{ fontSize: 16 }}>
                    {item.name}
                  </Typography>
                } />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  {item.children?.map(renderMenuItem)}
                </List>
              </Collapse>
            </>
          )}
        </Dropdown>
      );
    }
    return (
      <ListItem
        button
        key={item.id}
        onClick={() => {
          if (item.toAbs) {
            window.open(item.toAbs, "_blank")
          } else if (item.to) {
            navigate(item.to as string);
          } else if (item.onClick) {
            item.onClick();
          }
          appContext.setDrawerOpen(false);
        }}>
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={
          <Typography>
            {item.name}
          </Typography>
        } />
      </ListItem>
    )
  };
  return (
    <>
      {!fullScreen &&
        <SwipeableDrawer
          open={appContext.drawerOpen}
          onClose={() => appContext.setDrawerOpen(false)}
          onOpen={() => appContext.setDrawerOpen(true)}
        >
          <Toolbar />
          <Box
            sx={{ width: 300 }}
          >
            <List>
              {navItems.map(renderMenuItem)}
            </List>
          </Box>
        </SwipeableDrawer>
      }
      {!!fullScreen &&
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box
            sx={{ width: 300 }}
          >
            <List>
              {navItems.map(renderMenuItem)}
            </List>
          </Box>
        </Drawer>
      }
    </>
  );
}