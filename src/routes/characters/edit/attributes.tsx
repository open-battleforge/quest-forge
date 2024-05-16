import { Box, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { InputNumber } from 'components/input-number';
import { groupBy } from 'lodash';
import { getAttributes } from 'utils/data';

type props = {
  character: any,
  setCharacter: Function
};

export default function Attributes(props: props) {
  const { character, setCharacter } = props;
  const attributes = getAttributes();
  const boonList = Object.values(attributes);
  const groups = groupBy(boonList, 'category');
  return (
    <Box sx={{ mt: 2 }}>
      {Object.keys(groups).map((groupKey: string) => {
        const group = groups[groupKey];
        return (
          <>
            <Grid key={groupKey} container sx={{ mb: 3 }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <>
                {group.map((boon: any) => {
                  const boonId = boon.name.toLocaleLowerCase();
                  return (
                  <Grid item xs={4} key={boon.name}>
                    <InputNumber
                      key={boonId}
                      fullWidth
                      size="small"
                      label={boon.name}
                      variant="outlined"
                      value={character?.attributes?.[boonId] ?? ''}
                      min={0}
                      max={10}
                      onChange={(number: number) => {
                        setCharacter({
                          ...character,
                          attributes: {
                            ...character?.attributes,
                            [boonId]: number || 0
                          }
                        });
                      }}
                    />
                    <Typography key={boonId+'description'} sx={{ mt: 1 }} fontSize="12px" variant="body2">
                      {boon.description}
                    </Typography>
                  </Grid>
                )})}
              </>
            </Grid>
          </>
        );
      })}
    </Box>
  );
};