import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { gql, useMutation } from '@apollo/client';
import Errors from './Errors';
import { useRouter } from 'next/router';
import { newThreadValidationSchema } from '../formValidations';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  categoryId?: number;
}

const NewThread = ({ categoryId }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  const query = gql`
    mutation createThread($createThreadInput: CreateThreadInput!) {
      createThread(createThreadInput: $createThreadInput) {
        id
      }
    }
  `;

  const [newThread, { data, loading }] = useMutation(query, {
    fetchPolicy: 'no-cache',
    onError: (error) => setFormErrors(error),
    onCompleted: (data) => {
      router.push(`/thread/${data.createThread.id}/page-1`);
    },
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setFormErrors({});

    newThreadValidationSchema
      .validate(
        {
          title,
          description,
        },
        { abortEarly: false }
      )
      .then((validThread) => {
        newThread({
          variables: {
            createThreadInput: {
              threadTitle: validThread.title,
              threadDescription: validThread.description,
              categoryId,
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
      <h5>New Thread</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Thread Title</Form.Label>
          <Form.Control
            placeholder="Title"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Thread Description</Form.Label>
          <Form.Control
            placeholder="Description"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </Form.Group>
        <Errors error={formErrors} />
        <div className="text-end">
          {
            <Button type="submit">
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : data ? (
                <span>
                  Redirecting To New Thread{' '}
                  <Spinner animation="border" size="sm" />
                </span>
              ) : (
                'New Thread'
              )}
            </Button>
          }
        </div>
      </Form>
    </div>
  );
};

export default NewThread;
