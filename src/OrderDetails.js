// OrderDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from './service/api'; // Import the function from api.js


const OrderDetails = () => {
  const { user_id, order_id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrderDetails = async () => {
      const data = await fetchOrderDetails(user_id, order_id);
      setOrder(data);
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
    <div className="order-details">
      <h2>Order Details</h2>
      <h3>Order ID: {order_id}</h3>
      <h4>Total Price: ${order.total_price}</h4>
      <h4>Items Ordered:</h4>
      <ul>
        
        {order.order_items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <button className="btn btn-warning mt-4" onClick={handlePayNow}>
        Pay Now
      </button>
    </div>  
  );
};

export default OrderDetails;
