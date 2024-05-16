import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { getClasses } from 'utils/data';
import ReactMarkdown from 'react-markdown';

export default function Boon() {
  const boonData: any = getClasses();
  let params = useParams();
  const theBoonId = params.id ?? '';
  const theBoon = boonData[theBoonId];
  if (!theBoon) {
    return (
      <Container sx={{ mt: 2 }}>
      <Typography paragraph align='center'>
        Not found
      </Typography>
    </Container>
    )
  }
  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" align="center" justifyContent="center" alignItems="center" display="flex" gutterBottom>
        {theBoon.name}
        {/* <Chip label={theBoon?.cost?.join('/')} color="info" variant="outlined" size="small" sx={{ ml: 1 }} /> */}
      </Typography>
      <ReactMarkdown children={theBoon.description} />
    </Container>
  );
}