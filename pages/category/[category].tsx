import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import CategoryThread from '../../components/CategoryThread';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import client from '../../apollo-client';
import Spinner from '../../components/Spinner';
import NewThread from '../../components/NewThread';
import Alert from 'react-bootstrap/Alert';
interface Props {
  category: Category;
}

const Thread = ({ category }: Props) => {
  const router = useRouter();

  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <Spinner />;
  }

  const sortThreadFunction = (a: Thread, b: Thread) => {
    //get createdAt timestamp from thread latest post, or if no posts in thread set timestamp to 0
    const timestamp1 = new Date(a.latestPost?.createdAt || 0).getTime();
    const timestamp2 = new Date(b.latestPost?.createdAt || 0).getTime();
    const result = timestamp1 - timestamp2;
    return result === 0 ? 0 : result < 0 ? 1 : -1;
  };

  const sortedThreads: Thread[] = category.threads
    .slice()
    .sort(sortThreadFunction);

  return (
    <div>
      <h3>Category: {category.categoryTitle}</h3>
      <h4>{category.categoryDescription}</h4>
      <div>
        {!sortedThreads.length && <Alert variant="info">No Threads Yet</Alert>}
        {sortedThreads.map((thread: Thread) => (
          <CategoryThread key={thread.id} thread={thread} />
        ))}
      </div>
      <NewThread categoryId={category.id} />
    </div>
  );
};

export default Thread;

export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts

  const { data } = await client.query({
    query: gql`
      query {
        categories {
          id
        }
      }
    `,
  });

  // Get the paths we want to pre-render based on posts

  /*const paths = data.categories.map(
    (category: Category) => `/category/${category.id}`
  );*/
  const paths: string[] = [];

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const id = Number(params.category);
  const query = gql`
    query Category($id: Int!) {
      category(id: $id) {
        id
        categoryTitle
        categoryDescription
        threads {
          id
          threadTitle
          threadDescription
          postsCount
          createdAt
          author {
            id
            username
            avatar
          }
          latestPost {
            createdAt
            author {
              username
            }
          }
        }
      }
    }
  `;

  const { data } = await client.query({
    query: query,
    variables: {
      id: id,
    },
  });
  if (!data) {
    return {
      notFound: true,
    };
  }
  // Pass post data to the page via props
  return { props: { category: data.category }, revalidate: 1 };
};
