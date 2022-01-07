import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import userContext from '../contexts/userContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import Errors from '../components/Errors';
import Spinner from 'react-bootstrap/Spinner';

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const user = useContext(userContext);

  const logoutUser = () => {
    localStorage.removeItem('user');
    user.setUserFromLocalStorage();
    router.push('/login');
  };

  const handleLogout = () => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_HOST}auth/logout`, {
        withCredentials: true,
      })
      .then((response: any) => {
        logoutUser();
      })
      .catch((error) => {
        //catch axios errors
        if (error.response) {
          const responseMessage = error.response.data.message;
          //Logout if user not logged in
          responseMessage === 'Unauthorized'
            ? logoutUser()
            : setError(error.response.data.message);
        } else if (error.request) {
          setError(
            'Network Error! The request was made but no response was received.'
          );
        } else {
          setError(error.message);
        }
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <Errors error={error} />
      <Button
        className="d-block mx-auto"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <Spinner as="span" animation="border" size="sm" role="status" />
        ) : (
          'Logout'
        )}
      </Button>
    </>
  );
};

export default Logout;
