import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import client from '../../apollo-client';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import UserPosts from '../../components/UserPosts';
import UserProfile from '../../components/UserProfile';
import Spinner from '../../components/Spinner';

interface Props {
  user: User;
}

const User = ({ user }: Props) => {
  const router = useRouter();
  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <Spinner />;
  }

  return (
    <div>
      <h2 className="text-center">{user.username}</h2>
      <Tabs defaultActiveKey="profile" id="profile-tab" className="mb-3">
        <Tab
          eventKey="profile"
          title="Profile"
          tabClassName="bg-light text-dark"
        >
          <UserProfile user={user} />
        </Tab>
        <Tab eventKey="posts" title="Posts" tabClassName="bg-light text-dark">
          <UserPosts userId={user.id!} category={'userPosts'} />
        </Tab>
        <Tab eventKey="liked" title="Liked" tabClassName="bg-light text-dark">
          {<UserPosts userId={user.id!} category={'likedPosts'} />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default User;

export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts

  const { data } = await client.query({
    query: gql`
      query {
        users {
          id
        }
      }
    `,
  });
  // Get the paths we want to pre-render based on posts
  const paths: string[] = data.users.map((user: User) => `/user/${user.id}`);
  //const paths: string[] = [];
  //console.log(`paths`, paths);
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1

  const username = decodeURIComponent(params.username);
  const query = gql`
    query User($username: String!) {
      userByUsername(username: $username) {
        id
        username
        avatar
        createdAt
      }
    }
  `;

  const { data } = await client.query({
    errorPolicy: 'all',
    query: query,
    variables: {
      username: username,
    },
  });
  if (!data) {
    return {
      notFound: true,
    };
  }
  // Pass post data to the page via props
  return {
    props: { user: data.userByUsername },
    revalidate: 1,
  };
};
