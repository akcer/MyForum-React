import React from 'react';
import { Spinner as Loader } from 'react-bootstrap';

const Spinner = () => {
  return (
    <div className="text-center">
      <Loader animation="border" />
    </div>
  );
};

export default Spinner;
