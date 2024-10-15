// OrderDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from './service/api';
import { Container, Card, Button, ListGroup } from 'react-bootstrap';


const OrderDetails = () => {
  const { user_id, order_id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrderDetails = async () => {
      const data = await fetchOrderDetails(user_id, order_id);
      setOrder(data);
      console.log(data)
    };

    getOrderDetails();
  }, [user_id, order_id]);

  const handlePayNow = () => {
    navigate('/items');
  };

  if (!order) {
    return <div>Loading Your Order...</div>;
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-lg">
        <Card.Body>
          <Card.Title className="text-center text-3xl font-bold mb-4">Order Details</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Order ID: {order_id}</Card.Subtitle>

          <Card.Text className="text-xl font-semibold mt-2">
            Total Price:{" "}
            {order.total_price !== order.total_discounted_price ? (
              <>
                <span className="text-muted" style={{ textDecoration: 'line-through' }}>${order.total_price}</span>{" "}
                <span className="text-danger">${order.total_discounted_price}</span>
              </>
            ) : (
              <span>${order.total_price}</span>
            )}
          </Card.Text>

          <h4 className="font-semibold mt-4">Items Ordered:</h4>
          <ListGroup style={{ listStyleType: 'none', padding: 0 }}>
            {order.order_items.map((order_item) => (
              <ListGroup.Item key={order_item.id} className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                <img src="/esspreso.jpeg" alt="item" style={{ width: '10%', height: 'auto', marginRight: '1rem' }} />
                <div className="font-medium">
                  {order_item.item.name} - ${order_item.price}{" "}
                  {order_item.discounted_price !== order_item.price ? (
                    order_item.discounted_price === 0.0 ? (
                      <span className="text-danger font-weight-bold">FREE</span>
                    ) : (
                      <span className="text-danger font-weight-bold">${order_item.discounted_price}</span>
                    )
                  ) : null}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Button
            variant="warning"
            className="w-100 mt-4"
            onClick={handlePayNow}
          >
            Pay Now
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetails;
