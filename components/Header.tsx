import React, { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';
import userContext from '../contexts/userContext';

const Header = () => {
  const user = useContext(userContext);

  return (
    <Navbar collapseOnSelect expand="md">
      <Container fluid className="mx-3">
        <Link href="/" passHref>
          <Navbar.Brand>
            <h1 className="fw-bold">MyForum</h1>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-end"
          id="responsive-navbar-nav"
        >
          <Nav className="fs-5 fw-bold">
            <Nav.Item>
              <Link href="/" passHref>
                <Nav.Link className="text-dark">Home</Nav.Link>
              </Link>
            </Nav.Item>
            {
              //show if user NOT logged in
              !user.username && (
                <>
                  <Nav.Item>
                    <Link href="/login" passHref>
                      <Nav.Link className="text-dark">Login</Nav.Link>
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link href="/register" passHref>
                      <Nav.Link className="text-dark">Register</Nav.Link>
                    </Link>
                  </Nav.Item>
                </>
              )
            }

            {
              //show if user logged in
              user.username && (
                <>
                  <Nav.Item>
                    <Link href="/logout" passHref>
                      <Nav.Link className="text-dark">Logout</Nav.Link>
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link
                      href={`/user/${encodeURIComponent(user.username)}`}
                      passHref
                    >
                      <Nav.Link className="text-dark">{user.username}</Nav.Link>
                    </Link>
                  </Nav.Item>
                </>
              )
            }
            {
              // show if user logged in as admin
              user.isAdmin && (
                <Nav.Item>
                  <Link href="/admin" passHref>
                    <Nav.Link className="text-dark">Admin</Nav.Link>
                  </Link>
                </Nav.Item>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
