import { Card, Chip, Divider, Grid, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import Show from "components/show";
import { calculateCharacter } from "utils/data";
import { RuleView } from "./rules";
import { AttributeView } from "./attributes";
import { GearView } from "./gear";
import { PerksView } from "./perks";

export function BeastView(props: any) {
  const { beast } = props;
  const calculatedBeast = calculateCharacter(beast);
  const theme = useTheme();
  if (!beast) {
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
        {beast.name}
      </Typography>
      <Card variant="outlined" sx={{ p: 1, borderLeft: `5px solid ${theme.palette.primary.main}`}}>
        <Grid
          container
          columnSpacing={5}
          columns={{ xs: 6, sm: 6, md: 12 }}
          alignItems="start"
        >
          <Grid item xs={6}>
            <Box className="columns">
              <Show when={!!calculatedBeast.flavor}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography paragraph>{calculatedBeast.flavor}</Typography>{" "}
              </Show>
              <Divider sx={{ my: 1 }} />
              <Box className="no-break">
                <AttributeView character={calculatedBeast} />
                <Divider sx={{ my: 1 }} />
              </Box>
              <Box className="no-break">
                <Show when={!!calculatedBeast?.perks}>
                  <PerksView perks={calculatedBeast?.perks} />
                  <Divider sx={{ my: 1 }} />
                </Show>
              </Box>
              <Box className="no-break">
                <Show when={!!calculatedBeast?.inventory}>
                  <GearView gear={calculatedBeast?.inventory} />
                  <Divider sx={{ my: 1 }} />
                </Show>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className="no-break">
              <Show when={!!calculatedBeast?.inventory}>
                <Typography variant="h6" gutterBottom>
                  Rules
                </Typography>
                <RuleView
                  items={calculatedBeast?.inventory}
                  perks={beast?.perks}
                />
                <Divider sx={{ my: 1 }} />
              </Show>
            </Box>
          </Grid>
        </Grid>
        <Show when={!!calculatedBeast?.keywords}>
          <Typography variant="h6" gutterBottom>
            Keywords
          </Typography>
          <Box>
            {calculatedBeast?.keywords?.map((attribute: any, index: number) => (
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
