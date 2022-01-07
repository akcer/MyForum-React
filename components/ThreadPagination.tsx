import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface Props {
  threadId?: number;
  page: number;
  lastPage: number;
}

const ThreadPagination = ({ threadId, page, lastPage }: Props) => {
  return (
    <div>
      <Pagination className="justify-content-end">
        <Pagination.First
          href={`/thread/${threadId}/page-${1}`}
          disabled={page === 1}
        />
        <Pagination.Prev
          href={`/thread/${threadId}/page-${page - 1}`}
          disabled={page === 1}
        />
        <Pagination.Ellipsis />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Next
          href={`/thread/${threadId}/page-${page + 1}`}
          disabled={page === lastPage}
        />
        <Pagination.Last
          href={`/thread/${threadId}/page-${lastPage}`}
          disabled={page === lastPage}
        />
      </Pagination>
    </div>
  );
};

export default ThreadPagination;
