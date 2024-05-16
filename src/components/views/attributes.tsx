import { Typography, Grid, Divider } from "@mui/material";
import { getAttributes, getModifiers } from "utils/data";

export function AttributeView(props: any) {
  const { character } = props;
  const { attributes } = character;
  const allAttributes: Record<string, any> = getAttributes();
  const modifiers: Record<string, any> = getModifiers();
  const specialAttributes: Record<string, any> = {
    Defense: `${character?.rawDefense} ${
      character?.defense !== character?.rawDefense
        ? `(${character.defense})`
        : ""
    }`,
    Hitpoints: character.hitpoints
  };
  const StatBlockItem = (props: any) => {
    const { value, label } = props;
    return (
      <>
        <Typography textAlign="center" fontWeight="bold" sx={{ mb: 1 }}>
          {label}
        </Typography>
        <Typography textAlign="center">{value}</Typography>
      </>
    );
  };
  return (
    <>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={2}
        columns={{ xs: 6, sm: 6, md: 6 }}
        sx={{ mb: 1 }}
      >
        {Object.keys(specialAttributes).map((attr) => (
          <Grid item xs={3} key={attr}>
            <StatBlockItem
              label={attr}
              value={specialAttributes[attr]}
            />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Grid
        container
        rowSpacing={2}
        columnSpacing={2}
        columns={{ xs: 3, sm: 6, md: 6 }}
        sx={{ mb: 1 }}
      >
        {Object.keys(allAttributes).map((attr) => (
          <Grid item xs={1} key={attr}>
            <StatBlockItem
              label={allAttributes[attr]?.name}
              value={`${attributes?.[attr] || 0} (${
                modifiers[attributes?.[attr] || 0]
              })`}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
