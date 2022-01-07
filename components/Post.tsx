import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { formatDistance } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import RemovePostButton from './RemovePostButton';
import LikePostButton from './LikePostButton';
import ShareButton from './ShareButton';
import { useRouter } from 'next/router';
import { replaceAvatarImgWithError } from '../utils/replaceImgWithError';

interface Props {
  post: Post;
  reply?: string;
  quote?: (post: string) => void;
  setReply?: (reply: string) => void;
  setEditedPostId?: (id: number | null) => void;
}

const Post = ({ post, reply, quote, setReply, setEditedPostId }: Props) => {
  const router = useRouter();
  return (
    <>
      <Row className="mb-3">
        <Col xs={12} lg={2}>
          <div className="d-flex flex-row flex-lg-column align-items-lg-center pb-1">
            <Image
              src={post.author?.avatar!}
              onError={replaceAvatarImgWithError}
              width={68}
              height={68}
              layout="fixed"
              alt="Picture of the author"
              className="rounded"
            />
            <div className="ps-2 ps-lg-0 text-lg-center">
              <Link href={`/user/${post.author?.username}`}>
                <a className="mb-1 fs-5 fw-bold">{post?.author?.username}</a>
              </Link>
              <p className="mb-1">
                Joined:{' '}
                {formatDistance(
                  new Date(String(post?.author?.createdAt)),
                  new Date(),
                  {
                    addSuffix: true,
                  }
                )}
              </p>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={10}>
          <Card className="d-flex shadow-sm" id={String(post.id)}>
            <Card.Header>
              <span>
                Created: 
                {formatDistance(new Date(String(post.createdAt)), new Date(), {
                  addSuffix: true,
                })}
              </span>
              {
                //link to post
                //split url to remove hash part if already is in url
              }
              <Link href={`${router.asPath.split('#')[0]}#${post.id}`}>
                <a className="float-end">#{post.id}</a>
              </Link>
            </Card.Header>
            <Card.Body>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.post!}
              </ReactMarkdown>
            </Card.Body>
            <Card.Footer className="py-0">
              {
                //show button only if quote prop provided
              }
              {quote && (
                <Button
                  size="sm"
                  variant="light"
                  className="bi bi-reply-fill ps-0"
                  onClick={() => quote(reply + post.post!)}
                >
                  <span className="ps-1">Reply</span>
                </Button>
              )}
              <LikePostButton postId={post.id} likingUsers={post.likingUsers} />
              <ShareButton />
              {
                //show button only when setReply && setEditedPostId provided
              }
              {setReply && setEditedPostId && (
                <Button
                  size="sm"
                  variant="light"
                  className="bi bi-pencil-fill"
                  onClick={() => {
                    setReply(post.post || '');
                    setEditedPostId(post.id || null);
                  }}
                >
                  <span className="ps-1">Edit</span>
                </Button>
              )}
              <RemovePostButton
                postId={post.id}
                author={post?.author?.username}
              />
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Post;
