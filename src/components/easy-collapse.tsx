import React from 'react';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Show from './show';

type props = {
  children: any,
  hideLess?: boolean,
  moreText?: string,
  lessText?: string
}

export const EasyCollapse = (props: props) => {
  const { children, hideLess, moreText, lessText } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  }
  return (
    <>
      {!isOpen && <Button fullWidth onClick={handleToggle}>{moreText || 'More'}</Button>}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
      <Show when={!!isOpen && !hideLess}><Button fullWidth onClick={handleToggle}>{lessText || 'Less'}</Button></Show>
    </>
  );
};
