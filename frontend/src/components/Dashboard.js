import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define the API base URL for the Render backend
const API_BASE_URL = "https://grocery-store-management-system.onrender.com";

// Function to format datetime as stored (already in IST)
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';

  // Use regex to parse the datetime string in "YYYY-MM-DD HH:mm:ss" format
  const regex = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/;
  const match = dateString.match(regex);

  if (!match) {
    console.error('Failed to parse datetime with regex:', dateString);
    return 'Invalid Date';
  }

  const [, year, month, day, hour, minute, second] = match.map(Number);
  
  // Create a Date object as local time (IST), without UTC interpretation
  const date = new Date(year, month - 1, day, hour, minute, second);

  if (isNaN(date.getTime())) {
    console.error('Invalid Date object created:', dateString);
    return 'Invalid Date';
  }

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Use 24-hour format (e.g., 14:00 for 2:00 PM)
  };
  // Format the date without timezone conversion (already in IST)
  return date.toLocaleString('en-IN', options).replace(/,/, '');
};

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/getAllOrders`)
      .then(response => response.json())
      .then(data => {
        console.log('Orders fetched:', data);
        setOrders(data || []);
        const total = data.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        setTotalCost(total);
      })
      .catch(error => {
        setError(error.message);
        setTimeout(() => setError(null), 3000);
      })      
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetails = (order) => {
    console.log('Selected order details:', order.order_details);
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const calculateDetailsTotal = (details) => {
    return details.reduce((sum, detail) => sum + parseFloat(detail.total_price || 0), 0).toFixed(2);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="right content-page">
      <div className="body content rows scroll-y">
        {loading && (
          <div className="loading">
            <span>Loading...</span>
          </div>
        )}
        <form className="form-horizontal">
          <div className="box-info full" id="taskFormContainer">
            <h2>Order Details</h2>
            <div className="panel-body pt-0">
              <div className="row mb-4">
                <div className="col-sm-12">
                  <div className="search-bar" style={{ position: 'relative' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Search by Customer Name - {filteredOrders.length} {filteredOrders.length > 1 ? "Orders Found" : "Order Found"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter customer name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: '100%' }}
                      />
                    </div>
                    <div className="button-group" style={{ position: 'relative', marginLeft: '8px' }}>
                      {error && <div className="notification error" style={{ top: '-60px', right: 0 }}>{error}</div>}
                      <Link to="/order" className="btn btn-success" style={{ marginLeft: '8px', fontSize: '0.85rem', fontWeight: '500', padding: '6px 12px', textDecoration: 'none' }}>
                        New Order
                      </Link>
                      <Link to="/manage-product" className="btn btn-primary" style={{ marginLeft: '8px', fontSize: '0.85rem', fontWeight: '500', padding: '6px 12px', textDecoration: 'none' }}>
                        Manage Products
                      </Link>
                    </div>
                  </div>
                  <div className="table-container">
                    <table className="table orders_table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Order Number</th>
                          <th>Customer Name</th>
                          <th>Total Order</th>
                          <th>Order Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(order => (
                          <tr key={order.order_id}>
                            <td>{formatDateTime(order.datetime)}</td>
                            <td>{order.order_id}</td>
                            <td>{order.customer_name}</td>
                            <td>{parseFloat(order.total).toFixed(2)} Rs</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-xs btn-info"
                                style={{ marginLeft: '0px', fontSize: '14px', fontWeight: '500' }}
                                onClick={() => handleViewDetails(order)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'end' }}><b>Total</b></td>
                          <td><b style={{ color: 'green', marginLeft: '10px' }}>₹ {totalCost.toFixed(2)}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showDetailsModal && selectedOrder && (
        <div className="modal fade-scale show" role="dialog" data-backdrop="static">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Order Details - Order #{selectedOrder.order_id}</h4>
                <h4 className="modal-title">Customer: {selectedOrder.customer_name}</h4>
              </div>
              <div className="modal-body">
                {selectedOrder.order_details && selectedOrder.order_details.length > 0 ? (
                  <div className="table-container">
                    <table className="table order-details">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Price Per Unit (Rs)</th>
                          <th>Total Price (Rs)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.order_details.map((detail, index) => (
                          <tr key={`${detail.order_id}-${index}`}>
                            <td>{detail.product_name || 'Unknown'}</td>
                            <td>{detail.quantity || 0}</td>
                            <td>{detail.uom_name || 'N/A'}</td>
                            <td>{detail.price_per_unit ? parseFloat(detail.price_per_unit).toFixed(2) : '0.00'}</td>
                            <td>{detail.total_price ? parseFloat(detail.total_price).toFixed(2) : '0.00'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ textAlign: 'end', fontWeight: 'bold', paddingRight: '20px', color: 'green' }}>
                      <strong>Total Order Amount: </strong> ₹ {parseFloat(selectedOrder.total).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: 'red' }}>No order details available for this order.</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;