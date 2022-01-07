import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { gql } from '@apollo/client';
import client from '../apollo-client';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import NewCategory from '../components/NewCategory';
interface Props {
  sections: Section[];
}

const Home = ({ sections }: Props) => {
  return (
    <div className={'styles.container'}>
      {sections.map((section) => (
        <Card key={section.id} className="mb-2 shadow-sm">
          <Card.Header>
            <h2 className="fw-bold">{section.section}</h2>
          </Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              {!!section.categories &&
                section.categories.map((category) => (
                  <ListGroup.Item key={category.id}>
                    <Card.Title className="fw-bold">
                      <Link
                        href={`/category/${encodeURIComponent(category.id!)}`}
                      >
                        {category.categoryTitle}
                      </Link>
                    </Card.Title>
                    <Card.Text>{category.categoryDescription}</Card.Text>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
      <NewCategory
        sections={sections.map((section) => ({
          id: section.id,
          section: section.section,
        }))}
      />
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({
    query: gql`
      query {
        sections {
          id
          section
          categories {
            id
            categoryTitle
            categoryDescription
          }
        }
      }
    `,
  });

  return {
    props: {
      sections: data.sections,
    },
    revalidate: 10,
  };
};
