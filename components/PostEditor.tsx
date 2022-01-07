import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { gql, useMutation } from '@apollo/client';
import Errors from './Errors';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import styles from '../styles/PostEditor.module.css';
interface Props {
  reply: string;
  threadId?: number;
  editedPostId: number | null;
}

const PostEditor = ({ reply, threadId, editedPostId }: Props) => {
  const [post, setPost] = useState('');
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setPost(reply);
  }, [reply]);

  const createPostQuery = gql`
    mutation createPost($createPostInput: CreatePostInput!) {
      createPost(createPostInput: $createPostInput) {
        id
      }
    }
  `;
  const [addPost, { data, loading, error }] = useMutation(createPostQuery, {
    onError: (error) => {
      setErrors(error);
      console.log(error);
    },
  });

  const handleAddPost = () => {
    setErrors({});
    addPost({
      variables: {
        createPostInput: {
          post,
          threadId,
        },
      },
    });
    setPost('');
  };

  const updatePostQuery = gql`
    mutation updatePost($updatePostInput: UpdatePostInput!) {
      updatePost(updatePostInput: $updatePostInput) {
        id
      }
    }
  `;

  //https://github.com/trojanowski/react-apollo-hooks/issues/120#issuecomment-513878645
  const [updatePost, { data: updatedPostData, loading: updatedPostLoading }] =
    useMutation(updatePostQuery, {
      onError: (error) => {
        setErrors(error);
        console.log(error);
      },
    });

  const sendUpdatedPost = () => {
    setErrors({});
    updatePost({
      variables: {
        updatePostInput: {
          post,
          threadId,
          id: editedPostId,
        },
      },
    });
    setPost('');
  };

  return (
    <div>
      <Form className="mb-3">
        <Form.Group>
          <Form.Label>
            <h4>Your Reply</h4>
          </Form.Label>
          <div className="bg-white border rounded">
            <Form.Control
              className={styles.textarea}
              as="textarea"
              placeholder="Write Your Reply..."
              rows={10}
              value={post}
              onChange={(e) => setPost(e.target.value)}
            />
            <div className="p-1 border-top">
              <Button
                title="Bold"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n **Bold text**')}
              >
                <i className="bi bi-type-bold"></i>
              </Button>
              <Button
                title="Emphasize"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n *Italic text*')}
              >
                <i className="bi bi-type-italic"></i>
              </Button>
              <Button
                title="Strikethrough"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n ~~Line Through~~')}
              >
                <i className="bi bi-type-strikethrough"></i>
              </Button>
              <Button
                title="Numbered List"
                variant="outline-secondary"
                className="border-0"
                onClick={() =>
                  setPost(
                    post + '\n 1. List item \n 2. List item \n 3. List item'
                  )
                }
              >
                <i className="bi bi-list-ol"></i>
              </Button>
              <Button
                title="Bulleted List"
                variant="outline-secondary"
                className="border-0"
                onClick={() =>
                  setPost(post + '\n - List item \n - List item \n - List item')
                }
              >
                <i className="bi bi-list-ul"></i>
              </Button>
              <Button
                title="Code"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n `Code`')}
              >
                <i className="bi bi-code"></i>
              </Button>
              <Button
                title="Heading 1"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n # H1')}
              >
                <i className="bi bi-type-h1"></i>
              </Button>
              <Button
                title="Heading 2"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n ## H2')}
              >
                <i className="bi bi-type-h2"></i>
              </Button>
              <Button
                title="Heading 3"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n ### H3')}
              >
                <i className="bi bi-type-h3"></i>
              </Button>
              <Button
                title="Quote"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n > Quote \n')}
              >
                <i className="bi bi-blockquote-left"></i>
              </Button>
              <Button
                title="Add Image"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n ![alt text](image-link.jpg)')}
              >
                <i className="bi bi-card-image"></i>
              </Button>
              <Button
                title="Add Link"
                variant="outline-secondary"
                className="border-0"
                onClick={() =>
                  setPost(post + '\n [title](https://www.example.com)')
                }
              >
                <i className="bi bi-link-45deg"></i>
              </Button>
              <Button
                title="Table"
                variant="outline-secondary"
                className="border-0"
                onClick={() =>
                  setPost(
                    post +
                      '\n|Syntax|Description|\n|-----------|-----------|\n|Header|Title|\n|Paragraph|Text|'
                  )
                }
              >
                <i className="bi bi-table"></i>
              </Button>
              <Button
                title="Horizontal Line"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost(post + '\n ---')}
              >
                <i className="bi bi-distribute-vertical"></i>
              </Button>
              <Button
                title="Erase"
                variant="outline-secondary"
                className="border-0"
                onClick={() => setPost('')}
              >
                <i className="bi bi-eraser"></i>
              </Button>
            </div>
          </div>
        </Form.Group>
      </Form>
      <Errors error={errors} />
      {updatedPostData && (
        <Alert className="mt-3" variant="success">
          Post Edited
        </Alert>
      )}
      {data && (
        <Alert className="mt-3" variant="success">
          Post Submitted
        </Alert>
      )}
      <div className="d-flex justify-content-end my-2">
        <Button
          title="Preview"
          className="me-2"
          variant="outline-primary"
          onClick={() => setPreview(!preview)}
        >
          <i className="bi bi-eye-fill"></i> Preview
        </Button>
        {/*<Button title="Send" variant="outline-primary" onClick={handleAddPost}>
          <i className="bi bi-reply-fill"></i> Add New Post
      </Button>*/}

        <Button
          title="Add"
          variant="outline-primary"
          onClick={handleAddPost}
        >
          <i className="bi bi-reply-fill me-1"></i>
          {loading ? <Spinner animation="border" size="sm" /> : 'Add New Post'}
        </Button>

        {
          //Show edit post button if editedPostId != null
          editedPostId && (
            <Button
              title="Edit"
              variant="outline-primary"
              className="ms-2"
              onClick={sendUpdatedPost}
            >
              <i className="bi bi-pencil-fill me-1"></i>
              {updatedPostLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Edit'
              )}
            </Button>
          )
        }
      </div>
      <div className={preview ? 'd-block' : 'd-none'}>
        <h4>Preview</h4>
        <Card>
          <Card.Body>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post}</ReactMarkdown>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default PostEditor;
