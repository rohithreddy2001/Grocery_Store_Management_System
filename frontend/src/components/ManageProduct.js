import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';

const API_BASE_URL = "https://grocery-store-management-system.onrender.com";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error notification
  const [success, setSuccess] = useState(null); // State for success notification

  useEffect(() => {
    setLoading(true); // Set loading to true when fetch starts
    fetch(`${API_BASE_URL}/getProducts`)
      .then(response => response.json())
      .then(data => {
        setProducts(data || []); // Ensure data is an array
        setFilteredProducts(data || []); // Sync filteredProducts with products
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      })
      .finally(() => setLoading(false)); // Set loading to false when fetch completes or fails
  }, []);

  // Filter products based on search term
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    const query = searchTerm.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/deleteProduct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `product_id=${productId}`
        });
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error); // Throw the specific error (e.g., order dependency)
        }
        // Immediately update state to reflect deletion (like the old code)
        setProducts(products.filter(product => product.product_id !== productId));
        setFilteredProducts(filteredProducts.filter(product => product.product_id !== productId));
        setSuccess(`Product "${productName}" deleted successfully!`);
        setTimeout(() => setSuccess(null), 3000); // Auto-hide success after 3 seconds
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.message); // Display the specific error message
        setTimeout(() => setError(null), 3000); // Auto-hide error after 3 seconds
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
    setSelectedProduct(null);
    setLoading(true);
    fetch(`${API_BASE_URL}/getProducts`)
      .then(response => response.json())
      .then(data => {
        setProducts(data || []);
        setFilteredProducts(data || []);
        setSuccess(selectedProduct ? 'Product updated successfully!' : 'Product added successfully!');
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to refresh product list.');
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setSuccess(null);
          setError(null);
        }, 3000); // Auto-hide notifications after 3 seconds
      });
  };

  return (
    <div className="right content-page">
      <div className="body content rows scroll-y">
        {loading && (
          <div className="loading">
            <span>Loading...</span>
          </div>
        )}
        <div className="box-info full" id="taskFormContainer">
          <h2>Manage Products</h2>
          <div className="panel-body pt-0">
            <div className="row mb-4">
              <div className="col-sm-12">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'relative' }}>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label>Search by Product Name - {filteredProducts.length + (filteredProducts.length > 1 ? " Products Found" : " Product Found")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter product name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ maxWidth: '600px' }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    {error && <div className="notification error">{error}</div>}
                    {success && <div className="notification success">{success}</div>}
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