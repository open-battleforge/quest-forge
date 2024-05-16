import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';
import { getRules } from 'utils/data';
import ReactMarkdown from 'react-markdown';
import { insertVariables } from 'utils/strings';

const defaultOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'ul', 'li', 'br'],
  allowedAttributes: {
    'a': ['href']
  },
  allowedIframeHostnames: ['www.youtube.com']
};

const sanitize = (dirty: any, options: any) => ({
  __html: sanitizeHtml(
    dirty,
    { ...defaultOptions, ...options }
  )
});

const SanitizeHTML = ({ html, options }: any) => (
  <div dangerouslySetInnerHTML={sanitize(html, options)} />
);

export default function Boon() {
  const boonData: any = getRules();
  let params = useParams();
  const theBoonId = params.id ?? '';
  const theBoon = boonData[theBoonId];
  const variables: Record<string, string> = {};
  theBoon?.inputs?.forEach((input: string) => {
    variables[input] = input.toLocaleUpperCase();
  });
  const descriptionReplaced = insertVariables(theBoon.description, variables);
  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" align="center" justifyContent="center" alignItems="center" display="flex" gutterBottom>
        {theBoon.name}
      </Typography>
      <Typography paragraph>
        <ReactMarkdown children={descriptionReplaced} />
      </Typography>
      <SanitizeHTML html={theBoon.effect} />
    </Container>
  );
}