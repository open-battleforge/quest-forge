import { Box } from "@mui/material";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import { RuleView } from "components/views/rules";

export const Abilities = (props: any) => {
  const { calculatedCharacter } = props;
  const [activeFilters, setActiveFilters] = useState(new Set());
  const filters: Record<string, any> = { attack: 'Attack', ability: 'Ability', passive: 'Passive' };
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
      <Box>
        {Object.keys(filters).map((filter, index) => (
          <Chip
            key={index}
            label={filters[filter]}
            variant={activeFilters.has(filter) ? "filled" : "outlined"}
            color="primary"
            onClick={() => toggleFilter(filter)}
            sx={{ mr: 1, mb: 1, fontSize: "10px" }}
          />
        ))}
      </Box>
      <RuleView
        variant="cards"
        activeOnly
        typeFilters={Array.from(activeFilters)}
        items={calculatedCharacter?.inventory}
        perks={calculatedCharacter?.perks}
      />
    </>
  );
};