import React, { useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import userContext from '../contexts/userContext';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  postId?: number;
  author?: string;
}

const RemovePostButton = ({ postId, author }: Props) => {
  const user = useContext(userContext);

  const query = gql`
    mutation removePost($id: Int!) {
      removePost(id: $id)
    }
  `;

  const [remove, { data, loading, error }] = useMutation(query, {
    onError: (error) => console.log(error),
  });

  const handleRemovePost = () => {
    remove({
      variables: {
        id: postId,
      },
    });
  };

  return (
    <>
      {(user.isAdmin || user.username === author) && (
        <Button
          onClick={handleRemovePost}
          size="sm"
          variant="light"
          className="bi bi-trash-fill"
        >
          <span className="ps-1">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : data ? (
              <span className="text-success fw-bold">{data.removePost}</span>
            ) : error ? (
              <span className="text-danger fw-bold">{error.message}</span>
            ) : (
              'Remove'
            )}
          </span>
        </Button>
      )}
    </>
  );
};

export default RemovePostButton;
