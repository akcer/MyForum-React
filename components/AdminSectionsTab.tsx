import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { gql, useQuery, useMutation } from '@apollo/client';
import Errors from './Errors';
import { newSectionValidationSchema } from '../formValidations';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

const AdminSectionsTab = () => {
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [formErrors, setFormErrors] = useState({});

  const getSectionsQuery = gql`
    query GetSections {
      sections {
        id
        section
      }
    }
  `;

  useQuery(getSectionsQuery, {
    onError: (error) => setFormErrors(error.message),
    onCompleted: (data) => {
      setSections(data.sections);
    },
  });
  //Add New Section
  const addNewSectionQuery = gql`
    mutation createSection($createSectionInput: CreateSectionInput!) {
      createSection(createSectionInput: $createSectionInput) {
        section
      }
    }
  `;
  const [newSection, { data: newSectionData, loading: newSectionLoading }] =
    useMutation(addNewSectionQuery, {
      fetchPolicy: 'no-cache',
      onError: (error) => setFormErrors(error.message),
    });
  const addNewSection = (event: any) => {
    event.preventDefault();
    setFormErrors({});
    newSectionValidationSchema
      .validate(
        {
          section: newSectionTitle,
        },
        { abortEarly: false }
      )
      .then((validSection) => {
        newSection({
          variables: {
            createSectionInput: {
              section: validSection.section,
            },
          },
        });
      })
      .catch((error) => {
        setFormErrors(error);
      });
  };

  //Update Section
  const updateSectionQuery = gql`
    mutation updateSection($updateSectionInput: UpdateSectionInput!) {
      updateSection(updateSectionInput: $updateSectionInput) {
        section
      }
    }
  `;
  const [
    updateSection,
    { data: updateSectionData, loading: updateSectionLoading },
  ] = useMutation(updateSectionQuery, {
    fetchPolicy: 'no-cache',
    onError: (error) => setFormErrors(error.message),
  });
  const sendUpdatedSection = (event: any) => {
    event.preventDefault();
    setFormErrors({});
    newSectionValidationSchema
      .validate(
        {
          section: selectedSection?.section,
        },
        { abortEarly: false }
      )
      .then((validSection) => {
        updateSection({
          variables: {
            updateSectionInput: {
              id: selectedSection?.id,
              section: validSection.section,
            },
          },
        });
      })
      .catch((error) => {
        setFormErrors(error);
      });
  };

  //Remove Section
  const removeSectionQuery = gql`
    mutation removeSection($id: Int!) {
      removeSection(id: $id)
    }
  `;
  const [
    removeSection,
    { data: removeSectionData, loading: removeSectionLoading },
  ] = useMutation(removeSectionQuery, {
    fetchPolicy: 'no-cache',
    onError: (error) => {
      setFormErrors(error.message);
    },
  });
  const sendRemoveSection = (event: any) => {
    event.preventDefault();
    setFormErrors({});
    removeSection({
      variables: {
        id: selectedSection?.id,
      },
    });
  };

  return (
    <>
      <h5 className="text-center">New Section</h5>
      <Form onSubmit={addNewSection}>
        <Form.Group className="mb-3">
          <Form.Label>Section Title</Form.Label>
          <Form.Control
            placeholder="Section Title"
            onChange={(event) => setNewSectionTitle(event.target.value)}
            value={newSectionTitle}
          />
        </Form.Group>

        <div className="text-end">
          {
            <Button type="submit">
              {newSectionLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Add New Section'
              )}
            </Button>
          }
        </div>
        {newSectionData && (
          <Alert className="mt-3" variant="success">
            Section Added
          </Alert>
        )}
      </Form>
      <h5 className="text-center">Edit Section</h5>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Select Section</Form.Label>
          <Form.Select
            aria-label="Choose section"
            onChange={(e) => {
              setSelectedSection(sections[Number(e.target.value)]);
            }}
          >
            <option></option>
            {sections.map((section: Section, index) => (
              <option key={section.id} value={index}>
                {section.section}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {selectedSection && (
          <Form.Group className="mb-3">
            <Form.Label>Section Title</Form.Label>
            <Form.Control
              placeholder="Section Title"
              onChange={(event) =>
                setSelectedSection({
                  ...selectedSection,
                  section: event.target.value,
                })
              }
              value={selectedSection.section}
            />
          </Form.Group>
        )}
        {updateSectionData && (
          <Alert className="mt-3" variant="success">
            Section Updated
          </Alert>
        )}
        {removeSectionData && (
          <Alert className="mt-3" variant="success">
            Section Removed
          </Alert>
        )}
        <div className="d-flex justify-content-end mb-3">
          <Button className="me-3" onClick={sendUpdatedSection}>
            {updateSectionLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Update Section'
            )}
          </Button>
          <Button onClick={sendRemoveSection}>
            {removeSectionLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Remove Section'
            )}
          </Button>
        </div>
      </Form>
      <Errors error={formErrors} />
    </>
  );
};

export default AdminSectionsTab;
