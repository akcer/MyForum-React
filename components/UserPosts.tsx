import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import Spinner from './Spinner';
import Button from 'react-bootstrap/Button';
import Post from './Post';
import Alert from 'react-bootstrap/Alert';

interface Props {
  userId: number;
  category: 'userPosts' | 'likedPosts';
}

const UserPosts = ({ userId, category }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [order, setOrder] = useState('ASC');
  const [skip, setSkip] = useState(0);
  const postsPerPage = 2;
  const getUserPosts = gql`
    query GetPosts($id: Int!, $take: Int!, $skip: Int!, $order: String!) {
      postsByAuthorId(id: $id, take: $take, skip: $skip, order: $order) {
        id
        authorId
        post
        createdAt
        author {
          username
          avatar
          createdAt
        }
        likingUsers {
          username
        }
      }
    }
  `;

  const getLikedPosts = gql`
    query GetPosts($id: Int!, $take: Int!, $skip: Int!, $order: String!) {
      likedPosts(id: $id, take: $take, skip: $skip, order: $order) {
        id
        authorId
        post
        createdAt
        author {
          username
          avatar
          createdAt
        }
        likingUsers {
          username
        }
      }
    }
  `;

  const [loadPosts, { loading, error }] = useLazyQuery(
    category === 'userPosts' ? getUserPosts : getLikedPosts,
    {
      variables: { id: userId, take: postsPerPage, skip: skip, order: order },
      onCompleted: (data) => {
        setPosts([
          ...posts,
          ...data[category === 'userPosts' ? 'postsByAuthorId' : 'likedPosts'],
        ]);
      },
    }
  );

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, order]);

  if (error) return <Alert variant="danger">{`Error! ${error.message}`}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-end mb-1">
        <Button
          className="d-block"
          onClick={() => {
            setPosts([]);
            setSkip(0);
            setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
          }}
        >
          Sort {order === 'ASC' ? 'latest' : 'oldest'}
          <i
            className={`ms-1 bi  ${
              order === 'ASC' ? 'bi-sort-down' : 'bi-sort-up'
            }`}
          ></i>
        </Button>
      </div>
      <div>
        {posts.map((post: Post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <Button
          className="d-block mx-auto"
          onClick={() => {
            setSkip(skip + postsPerPage);
          }}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default UserPosts;
