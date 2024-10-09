import './App.css';
import { fetchItems, saveOrder, createUser, fetchLocations, API_URL } from './service/api';
import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
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
    setOrder((prevOrder) => [...prevOrder, item]);
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

  const handleCompleteOrder = async () => {
    const orderToSend = { user_id: user.id, order_items: order.map(item => item.id) };
    const createdOrder = await saveOrder(orderToSend); 
    setOrder([]);
    localStorage.removeItem('order');
    navigate(`/users/${user.id}/orders/${createdOrder.id}`);;
  };

  const handleSave = async () => {
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

  return (
    <main>
      <section className='mt-5'>
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="title fw-bolder">Hi, {user ? user.name : 'Guest'}</h1>
            <h3 className="title fw-bolder">What will you have today...?</h3>
          </div>
          <button className="btn btn-warning" onClick={() => handleCompleteOrder()}>Complete Order</button>
        </div>
      </section>

      <section className='mt-5'>
        <div className="container">
          <div className="row g-4">
            {items.length > 0 ? (
              items.map((item) => (
                <div className="col-md-4 col-sm-6" key={item.id}>
                  <div className="card-deck">
                    <div className="card">
                      <img class="card-img-top" src="/esspreso.jpeg" alt="Card image cap" style={{ width: '100%', height: '50%' }}></img>
                      <div className="card-header d-flex justify-content-between align-items-center bg-dark fw-bolder text-warning">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                      </div>
                      <div className="card-body d-flex justify-content-between align-items-start">
                        <p className="card-text me-auto">{item.description}</p>
                        <button className="btn btn-warning ms-3" onClick={() => addToOrder(item)}>
                          <i className="bi bi-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No items available</p> // Centered message for no items
            )}
          </div>
        </div>
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
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      
    </main>
  );
}

export default App;
