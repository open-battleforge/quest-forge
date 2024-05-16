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
import { useSnackbar } from "notistack";
import { InputNumber } from "components/input-number";
import { getItemFromId } from "utils/data";

const ListDialog = (props) => {
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

export const ChooseRace = (props) => {
  const { hideModal, races, selectRace } = props;
  const equipmentMapped = Object.keys(races).map((raceId) => {
    const theRace = races[raceId];
    return {
      name: theRace?.name,
      description: theRace?.description,
      id: raceId,
    };
  });
  const handleSelect = (option) => {
    selectRace(option.id);
  };
  return (
    <ListDialog
      title="Select Race"
      hideModal={hideModal}
      options={equipmentMapped}
      onSelect={handleSelect}
    />
  );
};

export const ChooseClass = (props) => {
  const { hideModal, classes, selectClass } = props;
  const equipmentMapped = Object.keys(classes).map((classId) => {
    const theClass = classes[classId];
    return {
      name: theClass?.name,
      description: theClass?.description,
      id: classId,
    };
  });
  const handleSelect = (option) => {
    selectClass(option.id);
  };
  return (
    <ListDialog
      title="Select Class"
      hideModal={hideModal}
      options={equipmentMapped}
      onSelect={handleSelect}
    />
  );
};

export const EditItem = (props) => {
  const { hideModal, character, setCharacter, itemIndex } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const item = character?.inventory?.[itemIndex];
  const itemData = getItemFromId(item);
  const updateItem = (updatedItem) => {
    setCharacter({
      ...character,
      inventory: [
        ...character?.inventory?.map((item, index) =>
          itemIndex === index ? updatedItem : item
        ),
      ],
    });
  };
  return (
    <Dialog
      open
      onClose={hideModal}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ px: 2 }} closeButton>
        Editing {itemData?.name}
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <Paper style={{ height: "100%", borderRadius: 0, overflowY: "auto" }}>
          <Box sx={{ p: 2 }}>
            <Typography paragraph gutterBottom>
              {itemData?.flavor}
            </Typography>
            <InputNumber
              label="Item Count"
              value={item?.count}
              onChange={(value) => updateItem({ ...item, count: value })}
            />
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={hideModal}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const BuyEquipment = (props) => {
  const { hideModal, equipment, addItem } = props;
  const { enqueueSnackbar } = useSnackbar();
  const filters = ["Armor", "Weapon", "Gear", "Spell"];
  const equipmentMapped = Object.keys(equipment).map((equipId) => {
    const theItem = equipment[equipId];
    return {
      name: `${theItem.name} (${theItem.cost} gp)`,
      description: theItem?.flavor,
      keywords: theItem?.keywords,
      id: equipId,
    };
  });
  const handleSelect = (option) => {
    enqueueSnackbar(`Added ${option.name}`, {
      variant: "success",
    });
    addItem(option.id);
  };
  return (
    <ListDialog
      title="Add Items"
      hideModal={hideModal}
      options={equipmentMapped}
      onSelect={handleSelect}
      filters={filters}
      multiple
    />
  );
};
