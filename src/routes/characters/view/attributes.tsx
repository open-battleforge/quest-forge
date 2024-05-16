import { Box, Card, Divider, Grid, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { getAttributes, getClass, getModifiers, getRace } from "utils/data";

const StatBlockItem = (props: any) => {
  const theme = useTheme();
  return (
  <Box alignContent="center" textAlign="center" key={props?.key}>
    <Card variant="outlined" sx={{ borderLeft: `5px solid ${theme.palette.primary.main}`}}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          p: 0.5
        }}
      >
        {props?.label}
      </Typography>
      <Typography fontWeight="bold" sx={{ p: 1 }}>
        {props?.value}
      </Typography>
    </Card>
  </Box>
)};

export const Attributes = (props: any) => {
  const { calculatedCharacter, character } = props;
  const attributes: Record<string, any> = getAttributes();
  const modifiers: Record<string, any> = getModifiers();
  const specialAttributes: Record<string, any> = {
    Level: calculatedCharacter?.level,
    Race: getRace(character?.race)?.name,
    Class: getClass(character?.class)?.name,
    Defense: `${calculatedCharacter?.rawDefense} ${
      calculatedCharacter?.defense !== calculatedCharacter?.rawDefense
        ? `(${calculatedCharacter.defense})`
        : ""
    }`,
    Hitpoints: calculatedCharacter.hitpoints,
    Weight: `${calculatedCharacter?.encumberance} / ${calculatedCharacter?.carryweight}`,
  };
  return (
    <>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={1}
        columns={{ xs: 18, sm: 18, md: 18 }}
        sx={{ mb: 1 }}
      >
        {Object.keys(specialAttributes || {}).map((attribute, index) => (
          <Grid item xs={6} key={index}>
            <StatBlockItem
              value={specialAttributes[attribute]}
              label={attribute}
            />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Grid
        container
        rowSpacing={1}
        columnSpacing={1}
        columns={{ xs: 18, sm: 18, md: 18 }}
        sx={{ mb: 1 }}
      >
        {Object.keys(attributes || {}).map((attribute, index) => (
          <Grid item xs={6} key={index}>
            <StatBlockItem
              value={`${calculatedCharacter?.attributes?.[attribute] || 0} (${
                modifiers[calculatedCharacter?.attributes?.[attribute] || 0]
              })`}
              label={attributes[attribute]?.name}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};