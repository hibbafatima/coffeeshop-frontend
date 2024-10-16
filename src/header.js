import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

function Header({ }) {
  return (
    <Navbar bg="dark" variant="dark" className="p-3 sticky-top">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/items" style={{ fontSize: '30px', fontWeight: 'bold' }}>
          CS
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/items" className="text-warning">Menu</Nav.Link>
          <Nav.Link href="#" className="text-warning">Promotions</Nav.Link>
          <Nav.Link href="#" className="text-warning">History</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link className="text-warning">Cart</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
