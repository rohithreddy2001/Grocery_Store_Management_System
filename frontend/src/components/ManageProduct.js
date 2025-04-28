import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';

const API_BASE_URL = "https://grocery-store-management-system.onrender.com";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search
  const [loading, setLoading] = useState(true); // State for loading
  const [notification, setNotification] = useState(null); // State for notifications

  useEffect(() => {
    setLoading(true); // Set loading to true when fetch starts
    fetch(`${API_BASE_URL}/getProducts`)
      .then(response => response.json())
      .then(data => setProducts(data || [])) // Ensure data is an array
      .catch(error => console.error('Error fetching products:', error))
      .finally(() => setLoading(false)); // Set loading to false when fetch completes or fails
  }, []);

  // Function to show notification and auto-hide after 3 seconds
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure to delete ${productName} item?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/deleteProduct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `product_id=${productId}`
        });
        const result = await response.json();
        if (result.error) {
          alert(result.error);
        } else {
          setProducts(products.filter(product => product.product_id !== productId));
          showNotification(`Product "${productName}" deleted successfully.`, 'success'); // Show delete notification
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('An error occurred while deleting the product.', 'error'); // Show error notification
      }
    }
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleModalSave = () => {
    setShowModal(false);
    const isUpdate = !!selectedProduct; // Check if it's an update or new product
    const productName = selectedProduct ? selectedProduct.name : 'New Product';
    setSelectedProduct(null);
    fetch(`${API_BASE_URL}/getProducts`)
      .then(response => response.json())
      .then(data => {
        setProducts(data || []); // Ensure data is an array
        showNotification(
          isUpdate 
            ? `Product "${productName}" updated successfully.` 
            : 'New product added successfully.', 
          'success'
        ); // Show add/update notification
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        showNotification('An error occurred while refreshing the product list.', 'error'); // Show error notification
      });
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="right content-page">
      <div className="body content rows scroll-y">
        {loading && (
          <div className="loading">
            <span>Loading...</span>
          </div>
        )}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <div className="box-info full" id="taskFormContainer">
          <h2>Manage Products</h2>
          <div className="panel-body pt-0">
            <div className="row mb-4">
              <div className="col-sm-12">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label>Search by Product Name - {filteredProducts.length + (filteredProducts.length > 1 ? " Products Found" : " Product Found")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter product name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{maxWidth: '600px' }} // Adjust width as needed
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm btn-success pull-right"
                      style={{ marginRight: '28px', fontSize: '14px', fontWeight: '500' }}
                      onClick={() => setShowModal(true)}
                    >
                      Add New Product
                    </button>
                  </div>
                </div>
                <table className="table products-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Unit</th>
                      <th>Price Per Unit</th>
                      <th style={{ width: '150px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.product_id}>
                        <td>{product.name}</td>
                        <td>{product.uom_name}</td>
                        <td>{product.price_per_unit}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-xs btn-warning"
                            style={{ marginLeft: '0px', fontSize: '14px', fontWeight: '500' }}
                            onClick={() => handleUpdate(product)}
                          >
                            Update
                          </button>
                            
                          <button
                            type="button"
                            className="btn btn-xs btn-danger"
                            style={{ marginLeft: '0px', fontSize: '14px', fontWeight: '500' }}
                            onClick={() => handleDelete(product.product_id, product.name)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <ProductModal
          onClose={handleModalClose}
          onSave={handleModalSave}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default ManageProduct;