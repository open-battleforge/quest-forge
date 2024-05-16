import { Card, Chip, Divider, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Show from "components/show";
import { getItemFromId } from "utils/data";
import { RuleView } from "./rules";

export function ItemView(props: any) {
  const { item } = props;
  const itemData = getItemFromId(item);
  const theme = useTheme();
  if (!item) {
    return <></>;
  }
  return (
    <>
      <Typography
        variant="h4"
        align="center"
        justifyContent="center"
        alignItems="center"
        display="flex"
        gutterBottom
      >
        {itemData.name}
      </Typography>
      <Card variant="outlined" sx={{ p: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }}>
        <Show when={!!itemData.flavor}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography paragraph>{itemData.flavor}</Typography>{" "}
          <Divider sx={{ my: 1 }} />
        </Show>
        <Show when={itemData?.rules}>
          <RuleView items={[item]} />
          <Divider sx={{ my: 1 }} />
        </Show>
        <Show when={!!itemData?.keywords}>
          <Typography variant="h6" gutterBottom>
            Keywords
          </Typography>
          <Box>
            {itemData?.keywords?.map((attribute: any, index: number) => (
              <Chip
                key={index}
                label={attribute}
                color="secondary"
                variant="outlined"
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </Show>
      </Card>
    </>
  );
}
