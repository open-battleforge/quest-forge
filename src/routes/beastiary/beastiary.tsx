import { Box, CardActionArea, Chip, Container, useTheme } from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Show from "components/show";
import { AppContext } from "hooks/appcontext";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getBeasts } from "utils/data";

export default function Beastiary() {
  const navigate = useNavigate();
  const appContext = React.useContext(AppContext);
  const { searchText, setEnableSearch } = appContext;
  const theme = useTheme();
  React.useEffect(() => {
    setEnableSearch(true);
    return () => {
      setEnableSearch(false);
    };
  }, [setEnableSearch]);
  const beasts: Record<string, any> = getBeasts();
  const equipmentMapped = Object.keys(beasts).map((equipId: string) => {
    const theItem = beasts[equipId];
    return {
      ...theItem,
      id: equipId,
    };
  });
  const beastList: Array<any> = equipmentMapped.filter((beast) =>
    beast?.name?.toLocaleLowerCase()?.includes(searchText?.toLocaleLowerCase())
  );
  return (
    <Container>
      <Typography align="center" variant="h4" sx={{ my: 2 }}>
        Beastiary
      </Typography>
      <div>
        {beastList.map((beast: any, index: number) => (
          <Card
            className="no-break"
            key={index}
            onClick={() => navigate(`/beast/${beast.id}`)}
            sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }}
          >
            <CardActionArea sx={{ p: 1 }}>
              <Typography
                variant="h6"
                display="flex"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                {beast.name}
              </Typography>
              <Show when={!!beast?.flavor}>
                <Typography sx={{ mb: 1 }}>{beast?.flavor}</Typography>
              </Show>
              <Box>
                {beast?.keywords?.map((attribute: any, index: number) => (
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
            </CardActionArea>
          </Card>
        ))}
      </div>
    </Container>
  );
}
