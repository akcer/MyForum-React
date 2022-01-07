import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import client from '../../apollo-client';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ThreadPagination from '../../components/ThreadPagination';
import PostEditor from '../../components/PostEditor';
import Spinner from '../../components/Spinner';
import Alert from 'react-bootstrap/Alert';
import Post from '../../components/Post';
import { postsPerPage } from '../../globalVariables';
interface Props {
  thread: Thread;
  posts: Post[];
  postsCount: number;
}
//const postsPerPage = 10;
const Thread = ({ thread, posts, postsCount }: Props) => {
  const [reply, setReply] = useState('');
  const [editedPostId, setEditedPostId] = useState<number | null>(null);
  const router = useRouter();
  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <Spinner />;
  }
  const quotePost = (post: string): void => {
    const quote = post.replaceAll('\n', '\n >');
    setReply(quote);
  };
  const sEditedPostId = (id: number | null) => {
    setEditedPostId(id);
  };
  const sReply = (reply: string) => {
    setReply(reply);
  };

  const query: any = router.query.thread;
  const page: number = Number(query[1].replace('page-', '')) || 1;
  const lastPage: number = Math.ceil((postsCount || 1) / postsPerPage);

  return (
    <div>
      <h3>Thread: {thread.threadTitle}</h3>
      <h4>{thread.threadDescription}</h4>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href={`/category/${thread.category.id}`}>
          {thread.category.categoryTitle}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{thread.threadTitle}</Breadcrumb.Item>
      </Breadcrumb>
      <ThreadPagination threadId={thread.id} page={page} lastPage={lastPage} />
      {!posts.length && (
        <Alert variant="info">No Posts Yet Ont This Page</Alert>
      )}
      {posts.map((post: Post) => (
        <Post
          key={post.id}
          post={post}
          quote={quotePost}
          reply={reply}
          setReply={sReply}
          setEditedPostId={sEditedPostId}
        />
      ))}
      <ThreadPagination threadId={thread.id} page={page} lastPage={lastPage} />
      <PostEditor
        reply={reply}
        threadId={thread.id}
        editedPostId={editedPostId}
      />
    </div>
  );
};

export default Thread;

export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts

  const { data } = await client.query({
    query: gql`
      query {
        threads {
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

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const threadId = Number(params.thread[0]);
  const page = Number(params.thread[1].replace('page-', '')) || 1;
  const skip = (page - 1) * postsPerPage;

  const query = gql`
    query Thread($id: Int!, $take: Int!, $skip: Int!) {
      thread(id: $id) {
        id
        threadTitle
        threadDescription
        createdAt
        category {
          id
          categoryTitle
        }
        author {
          username
        }
      }
      postsAndCount(id: $id, take: $take, skip: $skip) {
        posts {
          id
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
        postsCount
      }
    }
  `;

  const { data } = await client.query({
    query: query,
    variables: {
      id: threadId,
      take: postsPerPage,
      skip: skip,
    },
  });

  if (!data) {
    return {
      notFound: true,
    };
  }
  // Pass post data to the page via props
  return {
    props: {
      thread: data.thread,
      posts: data.postsAndCount.posts,
      postsCount: data.postsAndCount.postsCount,
    },
    revalidate: 1,
  };
};
