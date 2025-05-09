import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';

const API_BASE_URL = "https://grocery-store-management-system.onrender.com";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/getProducts`)
      .then(response => response.json())
      .then(data => {
        setProducts(data || []);
        setFilteredProducts(data || []);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      })
      .finally(() => setLoading(false));
  }, []);

  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    const query = searchTerm.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDelete = async (productId, productName) => {
    setDeleteStatus(true);
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/deleteProduct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `product_id=${productId}`
        });
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setProducts(products.filter(product => product.product_id !== productId));
        setFilteredProducts(filteredProducts.filter(product => product.product_id !== productId));
        setConfirmDelete(false);
        setDeleteStatus(false);
        setSuccess(`Product "${productName}" deleted successfully!`);
        setTimeout(() => setSuccess(null), 4000);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.message);
        setTimeout(() => setError(null), 5000);
        setConfirmDelete(false); // Close the confirmation dialog
        setDeleteStatus(false); // Reset delete status
      }
    }
  };

  const handleConfirmDelete = (product) => {
    setSelectedProduct(product); // Set the selected product
    setConfirmDelete(true); // Show the confirmation dialog
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null); // Reset selected product
    setShowModal(true); // Open the modal
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
        }, 3000);
      });
  };

  return (
    <div className="right content-page">
      {
          confirmDelete && (
            <div className="confirm-delete">
              <p style={{ fontSize: '18px' }}>
                Are you sure you want to delete "{selectedProduct?.name}"?
              </p>
              <div className="confirm-delete-buttons">
                <button
                  className="btn btn-success"
                  style={{ fontSize: '14px' }}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  style={{ fontSize: '14px' }}
                  onClick={() => handleDelete(selectedProduct.product_id, selectedProduct.name)}
                >
                  {deleteStatus ? "Deleting.." : "Delete"}
                </button>
              </div>
            </div>
          )
        }
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
                <div className="search-bar" style={{ position: 'relative' }}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Search by Product Name - {filteredProducts.length} {filteredProducts.length > 1 ? "Products Found" : "Product Found"}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter product name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                  <div style={{ position: 'relative', marginLeft: 0 }}>
                    {error && <div className="notification error" style={{ top: '-98px', right: '-6px' }}>{error}</div>}
                    {success && <div className="notification success" style={{ top: '-98px', right: '-6px' }}>{success}</div>}
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ marginLeft: '0px', fontSize: '0.85rem', fontWeight: '500', padding: '6px 12px' }}
                      onClick={handleAddNewProduct}
                    >
                      Add New Product
                    </button>
                  </div>
                </div>
                <table className="table products-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>Name</th>
                      <th style={{ width: '15%' }}>Unit</th>
                      <th style={{ width: '15%' }}>Price Per Unit</th>
                      <th style={{ width: 'auto' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.product_id}>
                        <td>{product.name}</td>
                        <td>{product.uom_name}</td>
                        <td>{product.price_per_unit}</td>
                        <td className="action-buttons">
                          <button
                            type="button"
                            className="btn btn-warning"
                            style={{ fontSize: '0.8rem', fontWeight: '500', padding: '4px 8px', minWidth: '60px' }}
                            onClick={() => handleUpdate(product)}
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ fontSize: '0.8rem', fontWeight: '500', padding: '4px 8px', minWidth: '60px' }}
                            onClick={() => handleConfirmDelete(product)}
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