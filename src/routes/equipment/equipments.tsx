import { CardActionArea, Container, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { AppContext } from 'hooks/appcontext';
import { sortBy } from 'lodash';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from 'utils/data';

export default function Equipments() {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const { searchText, setEnableSearch } = appContext;
  const theme = useTheme();
  useEffect(() => {
    setEnableSearch(true);
    return () => {
      setEnableSearch(false);
    }
  }, [ setEnableSearch ]);
  const weapons: Record<string, any> = getItems();
  const equipmentMapped = Object.keys(weapons).map((equipId: string) => {
    const theItem = weapons[equipId];
    return {
      ...theItem,
      id: equipId
    }
  });
  const boonList: Array<any> = sortBy(equipmentMapped.filter((boon) => boon?.name?.toLocaleLowerCase()?.includes(searchText?.toLocaleLowerCase())), 'name');
  return (
    <Container>
      <Typography align="center" variant="h4" sx={{ my: 2 }}>
        Equipment List
      </Typography>
      <div>
        {boonList.map((boon: any, index: number) => (
          <Card
            className="no-break"
            key={index}
            onClick={() => navigate(`/item/${boon.id}`)}
            sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }}
          >
            <CardActionArea
              sx={{ p: 1 }}
            >
              <Typography variant="h6" display="flex" alignItems="center">
                {boon.name}
              </Typography>
              {!!boon?.flavor && <Typography>
                {boon?.flavor}
              </Typography>}
            </CardActionArea>
          </Card>
        ))}
      </div>
    </Container>
  );
}