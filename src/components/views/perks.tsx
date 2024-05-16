import { Typography, Box } from "@mui/material";
import { getPerk } from "utils/data";

export function PerksView(props: any) {
  const { perks } = props;
  const perkString = perks?.map((perk: any) => {
    const perkData = getPerk(perk);
    return `${perkData?.name}${perkData?.inputs?.map((input: string) => `(${perk[input]})`) || ''}`;
  }).join(', ');
  return (
    <div className="no-break">
      <Typography variant="h6" gutterBottom>
        Perks
      </Typography>
      <Box>
        {perkString}
      </Box>
    </div>
  );
}
