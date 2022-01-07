import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from '../components/Spinner';
import Errors from '../components/Errors';
import { registerUserValidationSchema } from '../formValidations';
import { useRouter } from 'next/router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  const register = gql`
    mutation createUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        username
        avatar
      }
    }
  `;

  const [registerUser, { loading }] = useMutation(register, {
    fetchPolicy: 'no-cache',
    onError: (error) => setFormErrors(error),
    onCompleted: () => router.push('/login'),
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setFormErrors({});
    registerUserValidationSchema
      .validate(
        {
          username,
          email,
          password,
          confirmPassword,
          avatar,
        },
        { abortEarly: false }
      )
      .then((validUser) => {
        registerUser({
          variables: {
            createUserInput: {
              username: validUser.username,
              email: validUser.email,
              password: validUser.password,
              avatar: validUser.avatar,
            },
          },
        });
      })
      .catch((error) => {
        setFormErrors(error);
      });
  };

  return (
    <div>
      <Errors error={formErrors} />
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
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
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
        <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            autoComplete="current-password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupAvatar">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            placeholder="Avatar"
            autoComplete="avatar"
            onChange={(event) => setAvatar(event.target.value)}
            value={avatar}
          />
        </Form.Group>
        {loading ? (
          <Spinner />
        ) : (
          <Button className="d-block mx-auto" type="submit">
            Register
          </Button>
        )}
      </Form>
    </div>
  );
};

export default Register;
