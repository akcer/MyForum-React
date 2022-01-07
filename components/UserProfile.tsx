import React, { useState, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { format } from 'date-fns';
import styles from '../styles/UserProfile.module.css';
import userContext from '../contexts/userContext';
import Spinner from 'react-bootstrap/Spinner';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Errors from './Errors';
import { replaceAvatarImgWithError } from '../utils/replaceImgWithError';

interface Props {
  user: User;
}

const UserProfile = ({ user }: Props) => {
  const router = useRouter();
  const userCtx = useContext(userContext);
  const [error, setError] = useState<any>();
  const query = gql`
    mutation removeUser($id: Int!) {
      removeUser(id: $id)
    }
  `;

  const [remove, { loading }] = useMutation(query, {
    onError: (error) => setError(error),
    onCompleted: () => {
      router.replace('/');
    },
  });

  const handleRemoveUser = () => {
    remove({
      variables: {
        id: user.id,
      },
    });
  };

  return (
    <div className="d-flex flex-column align-items-center ">
      <Card className={`${styles.card} w-100 mb-2`}>
        <Card.Header className="text-center">
          <h3>{user.username}</h3>
        </Card.Header>
        <Card.Body>
          <Card.Img
            variant="top"
            src={user.avatar}
            alt={user.username}
            onError={replaceAvatarImgWithError}
          />
          <Card.Text className="text-center">
            Created At:{' '}
            {format(new Date(String(user.createdAt)), 'dd-MM-yyyy HH:mm:ss')}
          </Card.Text>
        </Card.Body>
      </Card>
      <Errors error={error} />
      {(userCtx.isAdmin || userCtx.username === user.username) && (
        <Button className="d-block mx-auto" onClick={handleRemoveUser}>
          <span className="ps-1">
            {loading ? <Spinner animation="border" /> : 'Remove User'}
          </span>
        </Button>
      )}
    </div>
  );
};

export default UserProfile;
