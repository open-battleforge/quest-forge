import { Container } from '@mui/material';
import { BeastView } from 'components/views/beast';
import { useParams } from 'react-router-dom';
import { getBeasts } from 'utils/data';

export default function Beast() {
  const beastData: any = getBeasts();
  let params = useParams();
  const theBeastId = params.id ?? '';
  const theBeast = beastData[theBeastId];
  if (!theBeast) {
    return <></>;
  }
  return (
    <Container sx={{ mt: 2 }}>
      <BeastView beast={theBeast} />
    </Container>
  );
}