import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';
import StraightenIcon from '@mui/icons-material/Straighten';
import { Box, CardActionArea, Container, Grid, Stack, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import logo from 'assets/images/logo_large.png';
import splash from 'assets/images/splash.jpg';
import { useNavigate } from "react-router-dom";

type CardType = {
  name: string,
  icon: any,
  text: string,
  to?: string,
  toAbs?: string
};

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const iconSize = '60px';
  const CARDS: Array<CardType> = [
    {
      name: "Rules",
      icon: <StraightenIcon style={{ fontSize: iconSize }} />,
      text: "Read the core rules and start playing.",
      to: "/rules"
    },
    {
      name: "Characters",
      icon: <PersonIcon style={{ fontSize: iconSize }} />,
      text: "Browse and edit your saved characters.",
      to: "/characters"
    },
    {
      name: "Adventures",
      icon: <MapIcon style={{ fontSize: iconSize }} />,
      text: "Start playing a pre-made adventure.",
      to: "/adventures"
    },
  ];
  return (
    <Box>
      <div
        style={{
          backgroundImage: `url(${splash})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: 'column' }} style={{ width: "100%", background: "rgba(0,0,0,0.7)" }}>
          <img
            // className={"d-block text-center logo clickable"}
            className={"d-block text-center logo"}
            src={logo}
            // onClick={() => history.push(`/games`)}
            alt="logo"
          />
        </Box>
      </div>
      <Container sx={{ mt: 2 }}>
        <Grid
          container
          rowSpacing={1}
          sx={{ mt: 2 }}
          columnSpacing={2}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {CARDS.map((card: any, index: number) => (
            <Grid item xs={4} key={index}>
              <Card>
                <CardActionArea
                  onClick={() =>
                    card.toAbs
                      ? window.open(card.toAbs, "_blank")
                      : navigate(card.to ?? '')
                  }
                >
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box sx={{ mr: 2, color: theme.palette.primary.main }}>{card.icon}</Box>
                      <Stack>
                        <Typography variant="h4" component="div">
                          {card.name}
                        </Typography>
                        <Typography align="left">{card.text}</Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
          Quest Forge is a simple role-playing game. 
          It intends to keep character creation both open, and simple to get players playing right away. Quest Forge seeks to be as rules light as possible yet provide enough depth for your decisions both in character creation
          and when playing to matter.
          </Typography>
          <Typography variant="body1" paragraph>

          </Typography>
        </Box>
      </Container>
    </Box>
  );
};