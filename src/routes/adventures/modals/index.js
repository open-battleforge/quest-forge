import { ListDialog } from "components/modals/list";
import { useSnackbar } from "notistack";
import { calculateThreat } from "utils/data";

export const ChooseAdventure = (props) => {
  const { hideModal, stories, selectStory } = props;
  const equipmentMapped = Object.keys(stories).map((classId) => {
    const theClass = stories[classId];
    return {
      name: theClass?.name,
      description: theClass?.description,
      id: classId,
    };
  });
  const handleSelect = (option) => {
    selectStory(option.id);
  };
  return (
    <ListDialog
      title="Select Story"
      hideModal={hideModal}
      options={equipmentMapped}
      onSelect={handleSelect}
    />
  );
};

export const AddNPCs = (props) => {
  const { hideModal, npcs, addNPC } = props;
  const { enqueueSnackbar } = useSnackbar();
  // const filters = ["Armor", "Weapon", "Gear", "Spell"];
  const equipmentMapped = Object.keys(npcs).map((equipId) => {
    const theItem = npcs[equipId];
    return {
      name: `${theItem.name} (${calculateThreat(theItem)} threat)`,
      description: theItem?.flavor,
      keywords: theItem?.keywords,
      id: equipId,
    };
  });
  const handleSelect = (option) => {
    enqueueSnackbar(`Added ${option.name}`, {
      variant: "success",
    });
    addNPC(option.id);
  };
  return (
    <ListDialog
      title="Add NPCs"
      hideModal={hideModal}
      options={equipmentMapped}
      onSelect={handleSelect}
      // filters={filters}
      multiple
    />
  );
};

