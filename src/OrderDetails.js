// OrderDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from './service/api';
import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import { queueOrderNotification } from './service/api';

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
    queueOrderNotification(order.user_id, order.id);
    navigate('/items');
  };

  if (!order) {
    return <div>Loading Your Order...</div>;
  }

  return (
    <Container className="mt-5 font-monospace">
      <Card className="shadow-lg">
        <Card.Body>
          <Card.Title className="text-center text-3xl font-bold mb-4">Order Details</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Order ID: {order_id}</Card.Subtitle>
          <h4 className="font-semibold mt-4">Items Ordered:</h4>
          <ListGroup style={{ listStyleType: 'none', padding: 0 }}>
            {order.order_items.map((order_item) => (
              <ListGroup.Item key={order_item.id} className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                <div className="text-center">
                  <img
                    src="/esspreso.jpeg"
                    alt="item"
                    style={{ width: 'auto', height: 'auto', marginBottom: '1rem' }}
                  />
                  <h4 className="font-bolder">{order_item.quantity} x {order_item.item.name}</h4>
                </div>
                <div className="font-medium">
                  {order_item.discounted_price ? (
                    <>
                      <span className="text-muted fs-4 text-decoration-line-through">
                        ${order_item.price}{" "}
                      </span>
                      {Number(order_item.discounted_price) === 0 ? (
                        <span className="text-danger font-weight-bold fs-3">FREE</span>
                      ) : (
                        <span className="text-danger font-weight-bold">
                          ${order_item.discounted_price}
                        </span>
                      )}
                    </>
                  ) : 
                    <span className="fs-4">
                      ${order_item.price}
                    </span>}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Card.Text className="mt-2 text-end fs-3">
            Total Price (with tax):{" "}
            {order.total_discounted_price ? (
              <>
                <span className="text-muted fs-4 text-decoration-line-through">${order.total_price}</span>{" "}
                <span className="text-danger fs-2">${order.total_discounted_price}</span>
              </>
            ) : (
              <span className='fs-4'>${order.total_price}</span>
            )}
          </Card.Text>

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
