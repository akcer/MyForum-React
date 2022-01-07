import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import { formatDistanceToNow, format } from 'date-fns';
import { replaceAvatarImgWithError } from '../utils/replaceImgWithError';
import styles from '../styles/CategoryThread.module.css';
import { postsPerPage } from '../globalVariables';

interface Props {
  thread: Thread;
}

const CategoryThread = ({ thread }: Props) => {
  return (
    <Card className="mb-3 p-2 d-flex flex-row align-items-center shadow-sm">
      <div className="ps-2 w-100">
        <Link href={`/thread/${thread.id!}/page-1`}>
          <a className="fw-bold fs-5">{thread.threadTitle}</a>
        </Link>
        <div
          className={`d-flex justify-content-between align-items-center ${styles.threadDetails}`}
        >
          <div className="me-1">
            <Image
              className="rounded-3  border border-1"
              width={54}
              height={54}
              layout="fixed"
              src={thread.author?.avatar!}
              onError={replaceAvatarImgWithError}
              alt={`${thread.author?.username} avatar`}
            />
          </div>
          <div>
            <Link
              href={`/user/${encodeURIComponent(thread.author?.username!)}`}
            >
              <a>Author: {thread.author?.username}</a>
            </Link>
            <div>
              Created:
              {format(new Date(String(thread.createdAt)), 'dd MMM yyyy')}
            </div>
            <div>
              <Link href={`/thread/${thread.id!}/page-1`}>
                <a className={styles.pagination}>1</a>
              </Link>
              <span> </span>
              <Link
                href={`/thread/${thread.id!}/page-${Math.ceil(
                  thread.postsCount! / postsPerPage
                )}`}
              >
                <a className={styles.pagination}>Last Page</a>
              </Link>
            </div>
          </div>
          <div className="ms-auto">
            <span className="bi bi-chat-fill"> {thread.postsCount}</span>
          </div>
          <div className="latest-post w-25 text-end">
            {thread.latestPost ? (
              <div>
                <div>Last Post</div>
                <div>
                  {formatDistanceToNow(
                    new Date(String(thread.latestPost.createdAt)),
                    {
                      addSuffix: true,
                    }
                  )}
                </div>
                <div>
                  <Link
                    href={`/user/${encodeURIComponent(
                      thread.latestPost?.author?.username || ''
                    )}`}
                  >
                    <a>by {thread.latestPost.author?.username}</a>
                  </Link>
                </div>
              </div>
            ) : (
              'No Posts Yet'
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
export default CategoryThread;
