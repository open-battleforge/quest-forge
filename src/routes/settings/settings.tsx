import { Container, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material';
import Typography from '@mui/material/Typography';
import { AppContext } from 'hooks/appcontext';
import React from 'react';

const THEMES = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export default function Home() {
  const appContext = React.useContext(AppContext);
  const { userPrefs, setUserPrefs } = appContext;
  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Settings
      </Typography>
      <FormGroup sx={{ mb: 2 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Theme</FormLabel>
          <RadioGroup
            row
            aria-label="theme-radio"
            name="theme-radio-group"
            value={userPrefs?.theme}
            onChange={(event) => {
              setUserPrefs({
                ...userPrefs,
                theme: event.target.value,
              });
            }}
          >
            {THEMES.map((type) => (
              <FormControlLabel
                key={type.value}
                value={type.value}
                control={<Radio />}
                label={type.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </FormGroup>
    </Container>
  );
};