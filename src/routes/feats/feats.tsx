import { CardActionArea, Chip, Container, Box, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { AppContext } from 'hooks/appcontext';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getClasses } from 'utils/data';

export default function Feats() {
  const appContext = React.useContext(AppContext);
  const { searchText, setEnableSearch } = appContext;
  const theme = useTheme();
  React.useEffect(() => {
    setEnableSearch(true);
    return () => {
      setEnableSearch(false);
    }
  }, [ setEnableSearch ]);
  const beans: Record<string, any> = getClasses();
  const boonsMapped = Object.keys(beans).map((equipId: string) => {
    const theItem = beans[equipId];
    return {
      ...theItem,
      id: equipId
    }
  });
  const boonList = Object.values(boonsMapped).filter((boon) => boon?.name?.toLocaleLowerCase()?.includes(searchText?.toLocaleLowerCase()));
  const navigate = useNavigate();
  return (
    <Container sx={{ mb: 2 }}>
      <Typography align="center" variant="h4" sx={{ my: 2 }}>
        Class List
      </Typography>
      <div>
        {boonList.map((boon: any, index: number) => (
          <Card
            className="no-break"
            key={index}
            onClick={() => navigate(`/class/${boon.id}`)}
            sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }}
          >
            <CardActionArea
              sx={{ p: 1 }}
            >
              <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
                {boon.name}
              </Typography>
              <Box>
                {boon?.tags?.map((attribute: string, index: number) => (
                  <Chip key={index} label={attribute} color="warning" variant="outlined" size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
              <Typography>
                {boon.description}
              </Typography>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </Container>
  );
}