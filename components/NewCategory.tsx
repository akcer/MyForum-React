import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { gql, useMutation } from '@apollo/client';
import Errors from './Errors';
import { useRouter } from 'next/router';
import { newCategoryValidationSchema } from '../formValidations';
import Spinner from 'react-bootstrap/Spinner';
interface Props {
  sections: Section[];
}

const NewCategory = ({ sections }: Props) => {
  const [section, setSection] = useState<number | null>(null);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  const query = gql`
    mutation createCategory($createCategoryInput: CreateCategoryInput!) {
      createCategory(createCategoryInput: $createCategoryInput) {
        id
      }
    }
  `;

  const [newCategory, { data, loading }] = useMutation(query, {
    fetchPolicy: 'no-cache',
    onError: (error) => setFormErrors(error),
    onCompleted: (data) => {
      router.push(`/category/${data.createCategory.id}`);
    },
  });
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setFormErrors({});
    newCategoryValidationSchema
      .validate(
        {
          section,
          categoryTitle,
          categoryDescription,
        },
        { abortEarly: false }
      )
      .then((validCategory) => {
        newCategory({
          variables: {
            createCategoryInput: {
              sectionId: validCategory.section,
              categoryTitle: validCategory.categoryTitle,
              categoryDescription: validCategory.categoryDescription,
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
      <h5>New Category</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Choose Section</Form.Label>
          <Form.Select
            aria-label="Choose section"
            onChange={(e) => {
              setSection(Number(e.target.value));
            }}
          >
            <option></option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.section}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category Title</Form.Label>
          <Form.Control
            placeholder="Category Title"
            onChange={(event) => setCategoryTitle(event.target.value)}
            value={categoryTitle}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category Description</Form.Label>
          <Form.Control
            placeholder="Category Description"
            onChange={(event) => setCategoryDescription(event.target.value)}
            value={categoryDescription}
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
                  Redirecting To New Category{' '}
                  <Spinner animation="border" size="sm" />
                </span>
              ) : (
                'Add New Category'
              )}
            </Button>
          }
        </div>
      </Form>
    </div>
  );
};

export default NewCategory;
