import { Card, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { getAttributes } from 'utils/data';

export default function Attributes() {
  const attributes = getAttributes();
  const boonList = Object.values(attributes);

  return (
    <Container>
      <Typography align="center" variant="h4" sx={{ my: 2 }}>
        Character Attributes
      </Typography>
      <div className="columns">
        {boonList.map((boon) => (
          <Card
            className="no-break"
            key={boon.name}
            sx={{ p: 1, mb: 1 }}
          >
            <Typography variant="h6" gutterBottom>
              {boon.name}
            </Typography>
            {boon.description}
          </Card>
        ))}
      </div>
    </Container>
  );
}