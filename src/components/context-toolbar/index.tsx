import {
  Box,
  Card,
  IconButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  ListItemIcon,
  Menu,
  MenuItem,
  useTheme,
  Chip
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterIcon from '@mui/icons-material/FilterAlt';
import { Dropdown } from "components/dropdown";
import { useState } from "react";
import Show from "components/show";

export const ContextToolbar = (props: any) => {
  const { contextActions: userContextActions, label, filters } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [showFilters, setShowFilters] = useState(false);
  const contextActions = [
    ...userContextActions
  ];
  if (filters?.length) {
    contextActions.push({
      name: "Filter",
      icon: <FilterIcon />,
      onClick: () => {
        setShowFilters(!showFilters);
      }
    })
  }
  const numActionsToShow = fullScreen ? contextActions?.length : 2;
  const [activeFilters, setActiveFilters] = useState(new Set());
  const toggleFilter = (filter: any) => {
    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
    } else {
      activeFilters.add(filter);
    }
    setActiveFilters(new Set(activeFilters));
  };
  return (
    <>
      <Card variant="outlined" sx={{ mb: 1, py: 0 }}>
        <Toolbar style={{ minHeight: 0, padding: "0 15px" }}>
          <Typography variant="h6" noWrap component="div">
            {label}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {contextActions
            ?.slice(0, numActionsToShow)
            ?.map((action: any, index: number) => (
              <IconButton
                key={index}
                size="large"
                color="inherit"
                title={action.name}
                onClick={() => action.onClick()}
                disabled={action.disabled}
              >
                {action.icon}
              </IconButton>
            ))}
          {!!(contextActions?.length - numActionsToShow > 0) && (
            <Dropdown>
              {({ handleClose, open, handleOpen, anchorElement }: any) => (
                <>
                  <IconButton
                    sx={{ color: "inherit" }}
                    style={{ paddingRight: 0 }}
                    onClick={handleOpen}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    anchorEl={anchorElement}
                    id="basic-menu"
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      dense: true,
                      onClick: handleClose,
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    {contextActions
                      ?.slice(numActionsToShow)
                      ?.map((action: any, index: number) => (
                        <MenuItem
                          key={index}
                          onClick={() => action.onClick()}
                          disabled={action.disabled}
                        >
                          <ListItemIcon>{action.icon}</ListItemIcon>
                          <ListItemText>{action.name}</ListItemText>
                        </MenuItem>
                      ))}
                  </Menu>
                </>
              )}
            </Dropdown>
          )}
        </Toolbar>
      </Card>
      <Show when={filters?.length && showFilters}>
        <Card variant="outlined" sx={{ mb: 1 }}>
          <Box sx={{ px: 2, pt: 1 }}>
            {(filters || []).map((filter: any) => (
              <Chip
                label={filter}
                variant={activeFilters.has(filter) ? "filled" : "outlined"}
                color="primary"
                onClick={() => toggleFilter(filter)}
                sx={{ mr: 1, mb: 1, fontSize: "10px" }}
              />
            ))}
          </Box>
        </Card>
      </Show>
    </>
  );
};
