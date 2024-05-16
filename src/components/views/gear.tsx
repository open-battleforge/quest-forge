import {
  Typography,
} from "@mui/material";
import { getItemFromId } from "utils/data";

export function GearView(props: any) {
  const { gear } = props;
  if (!gear) {
    return <></>;
  }
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Equipment
      </Typography>
      {gear.map((item: any) => {
        const itemData = getItemFromId(item);
        return itemData.name;
      }).join(', ')}
    </>
  );
}
