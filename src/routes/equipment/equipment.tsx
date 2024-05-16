import { Container } from '@mui/material';
import { ItemView } from 'components/views/equipment';
import { useParams } from 'react-router-dom';

export default function Equipment() {
  let params = useParams();
  const theItemId = params.id ?? '';
  if (!theItemId) {
    return <></>;
  }
  return (
    <Container sx={{ mt: 2 }}>
      <ItemView item={theItemId} />
    </Container>
  );
}