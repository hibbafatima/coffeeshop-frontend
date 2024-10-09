import axios from 'axios';

export const API_URL = 'http://localhost:3000'; 

export const fetchItems = async () => {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
};

export const saveOrder = async (data) => {
  try {
    const response = await fetch(`${API_URL}/users/${data.user_id}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orders: data }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userData }),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return await response.json();
};

export const fetchLocations = async () => {
  try {
    const response = await fetch(`${API_URL}/locations`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const fetchOrderDetails = async (user_id, order_id) => {
  const response = await fetch(`${API_URL}/users/${user_id}/orders/${order_id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  const data = await response.json();
  return data;
};
