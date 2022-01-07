import React, { useState, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import userContext from '../contexts/userContext';
import { loginUserValidationSchema } from '../formValidations';
import { useRouter } from 'next/router';
import Errors from '../components/Errors';
import Spinner from 'react-bootstrap/Spinner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useContext(userContext);
  const router = useRouter();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    loginUserValidationSchema
      .validate(
        {
          username,
          password,
        },
        { abortEarly: false }
      )
      .then((validUser) => {
        setLoading(true);
        axios
          .post(`${process.env.NEXT_PUBLIC_API_HOST}auth/login`, validUser, {
            withCredentials: true,
          })
          .then((response: any) => {
            localStorage.setItem('user', JSON.stringify(response?.data));
            user.setUserFromLocalStorage();
            router.push('/');
          })
          .catch((error) => {
            //catch axios errors
            if (error.response) {
              setError(error.response.data.message);
            } else if (error.request) {
              setError(
                'Network Error! The request was made but no response was received.'
              );
            } else {
              setError(error.message);
            }
          })
          .finally(() => setLoading(false));
      })
      .catch((error) => {
        //catch validation errors
        setError(error);
      });
  };
  return (
    <div>
      <Errors error={error} />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formGroupUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Enter Uername"
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
        </Form.Group>
        <Button className="d-block mx-auto" type="submit" disabled={loading}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" role="status" />
          ) : (
            'Login'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
