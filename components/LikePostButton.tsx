import React, { useState, useContext } from 'react';
import userContext from '../contexts/userContext';
import { gql, useMutation } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  postId?: number;
  likingUsers: User[];
}

const LikePostButton = ({ postId, likingUsers }: Props) => {
  const user = useContext(userContext);

  const [isPostLikedByUser, setIsPostLikedByUser] = useState(
    !!likingUsers.find((u) => u.username === user.username)
  );

  const query = gql`
    mutation likePost($postId: Int!) {
      likePost(postId: $postId)
    }
  `;
  const [like, { loading, error }] = useMutation(query, {
    onError: (error) => {
      console.log('Like error', { error });
    },
    onCompleted: () => {
      setIsPostLikedByUser(!isPostLikedByUser);
    },
  });
  const handleLikePost = () => {
    like({
      variables: {
        postId: postId,
      },
    });
  };

  return (
    <Button
      size="sm"
      variant="light"
      className="bi bi-hand-thumbs-up-fill"
      onClick={handleLikePost}
    >
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : error ? (
        <span className="text-danger fw-bold">{error.message}</span>
      ) : isPostLikedByUser ? (
        <span className="text-success fw-bold">Liked</span>
      ) : (
        <span className="ps-1">Like</span>
      )}
    </Button>
  );
};

export default LikePostButton;
