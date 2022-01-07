import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
interface Props {}

const ShareButton = ({}: Props) => {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <Button size="sm" variant="light" className="bi bi-facebook" />
        <Button size="sm" variant="light" className="bi bi-google" />
        <Button size="sm" variant="light" className="bi bi-rss-fill" />
        <Button size="sm" variant="light" className="bi bi-reddit" />
      </Popover.Body>
    </Popover>
  );
  return (
    <>
      <OverlayTrigger trigger={['focus']} placement="top" overlay={popover}>
        <Button size="sm" variant="light" className="bi bi-share-fill">
          <span className="ps-1">Share</span>
        </Button>
      </OverlayTrigger>
    </>
  );
};

export default ShareButton;
