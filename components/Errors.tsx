import React from 'react';
import Alert from 'react-bootstrap/Alert';

interface Props {
  error: any;
}

const Errors = ({ error }: Props) => {
  if (error?.graphQLErrors?.length) {
    return (
      <>
        {error.graphQLErrors.map((error: any, ind: number) => (
          <Alert key={ind} variant="danger">
            {error.message}
          </Alert>
        ))}
      </>
    );
  }
  if (error?.networkError) {
    return <Alert variant="danger">{error.networkError.message}</Alert>;
  }
  if (error?.name === 'ValidationError') {
    return (
      <>
        {error.errors.map((e: any, ind: number) => (
          <Alert key={ind} variant="danger">
            {e}
          </Alert>
        ))}
      </>
    );
  }
  if (error && typeof error == 'string') {
    return <Alert variant="danger">{error}</Alert>;
  }
  //return null if no error
  return null;
};

export default Errors;
