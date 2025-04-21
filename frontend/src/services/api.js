import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const getProducts = () => axios.get(`${BASE_URL}/getProducts`);
export const insertProduct = (data) => axios.post(`${BASE_URL}/insertProduct`, data);
export const deleteProduct = (id) => axios.post(`${BASE_URL}/deleteProduct`, { product_id: id });
// similarly for getAllOrders, insertOrder, getUOM, etc.


