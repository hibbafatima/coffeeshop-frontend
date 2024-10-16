import './App.css';
import { fetchItems, saveOrder, createUser, fetchLocations } from './service/api';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function App() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(true); // Show modal on page load
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(() => {
    const savedOrder = localStorage.getItem('order');
    return savedOrder ? JSON.parse(savedOrder) : [];
  });
  const navigate = useNavigate();
  const [itemCounters, setItemCounters] = useState({});

  useEffect(() => {
    const getItems = async () => {
        const data = await fetchItems();
        setItems(data);
    };

    getItems();
  }, []);

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
  }, [order]);

  const addToOrder = (item) => {
    const quantity = itemCounters[item.id] || 0;
    if (quantity > 0) {
      setOrder((prevOrder) => [...prevOrder, { item, quantity }]);
    } else {
      alert("Please select a valid quantity");
    }
  };

  useEffect(() => {
    const getLocations = async () => {
      try {
        const locationData = await fetchLocations();
        setLocations(locationData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
  
    getLocations();
  }, []);

  const handleCreateOrder = async () => {
    const orderToSend = {
      user_id: user.id,
      order_items: order.map(orderItem => ({
        item_id: orderItem.item.id,
        quantity: orderItem.quantity
      }))
    };
  
    try {
      const createdOrder = await saveOrder(orderToSend); 
      setOrder([]);
      localStorage.removeItem('order');
      navigate(`/users/${user.id}/orders/${createdOrder.id}`);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleCreateUser = async () => {
    if (!name || !email || !selectedLocation) {
      alert("Oops! Looks like you missed something. Please fill out all fields.");
      return;
    }
    const userData = { name: name, email: email, location_id: selectedLocation };
    try {
      const createdUser = await createUser(userData);
      setUser(createdUser)
      setShow(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleModalClose = () => {
    if (name.trim() === '') {
      return;
    }
    setShow(false);
  };

  const incrementCounter = (id) => {
    setItemCounters((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const decrementCounter = (id) => {
    setItemCounters((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0
    }));
  };

  return (
    <main>
      <section className='mt-5'>
        <Container className='d-flex justify-content-between align-items-center'>
          <div>
            <h1 className="title fw-bolder">Hi, {user ? user.name : 'Guest'}</h1>
            <h3 className="title fw-bolder">What will you have today...?</h3>
          </div>
          <Button variant="warning" onClick={handleCreateOrder}>Complete Order</Button>
        </Container>
      </section>

      <section className='mt-5'>
        <Container>
          <Row className='g-4'>
            {items.length > 0 ? (
              items.map((item) => (
                <Col md={4} sm={6} key={item.id}>
                  <Card className="h-100">
                    <Card.Img variant="top" src="/esspreso.jpeg" alt="Card image cap" style={{ objectFit: 'cover', height: '200px' }} />
                    <Card.Header className="d-flex justify-content-between align-items-center bg-dark fw-bolder text-warning">
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <p className="card-text">{item.description}</p>
                      <div className="d-flex align-items-center">
                        <Button variant="outline-warning" onClick={() => decrementCounter(item.id)}>-</Button>
                        <input
                          type="number"
                          className="form-control mx-1 text-center"
                          value={itemCounters[item.id] || 0}
                          readOnly
                          style={{ width: '50px' }}
                        />
                        <Button variant="outline-warning" onClick={() => incrementCounter(item.id)}>+</Button>
                        <Button variant="warning" className="ms-3" onClick={() => addToOrder(item)}>
                          <i className="bi bi-cart"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center">No items available</p>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <Modal show={show} onHide={handleModalClose} backdrop="static"> 
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="form-control"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Select your location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateUser}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default App;
