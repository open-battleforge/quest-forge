import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Chip,
  ListItemButton,
} from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box } from "@mui/system";
import { useState } from "react";
import { intersection, sortBy } from "lodash";

export const ListDialog = (props) => {
  const {
    title = "Choose Things",
    hideModal,
    options,
    onSelect,
    filters = [],
    multiple = false,
    closeText = multiple ? "Done" : "Cancel",
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeFilters, setActiveFilters] = useState(new Set());
  const toggleFilter = (filter) => {
    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
    } else {
      activeFilters.add(filter);
    }
    setActiveFilters(new Set(activeFilters));
  };
  const optionsFiltered = options.filter((option) => {
    const activeFiltersArr = Array.from(activeFilters);
    return (
      intersection(activeFiltersArr, option.keywords).length ||
      !activeFiltersArr.length
    );
  });
  const optionsSorted = sortBy(optionsFiltered, "name");
  return (
    <Dialog
      open
      onClose={hideModal}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "100%" } }}
    >
      <DialogTitle sx={{ px: 2 }} closeButton>
        {title}
      </DialogTitle>
      <Box sx={{ px: 2 }}>
        {filters.map((filter) => (
          <Chip
            label={filter}
            variant={activeFilters.has(filter) ? "filled" : "outlined"}
            color="primary"
            onClick={() => toggleFilter(filter)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>
      <DialogContent style={{ padding: 0 }}>
        <Paper style={{ height: "100%", borderRadius: 0, overflowY: "auto" }}>
          {optionsSorted.map((item, index) => {
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    onSelect(item);
                    if (!multiple) {
                      hideModal();
                    }
                  }}
                >
                  <ListItemText
                    sx={{ pr: 5 }}
                    primary={
                      <Typography fontWeight="bold">{item?.name}</Typography>
                    }
                    secondary={
                      <Typography variant="body2">
                        {item.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={hideModal}>
          {closeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
