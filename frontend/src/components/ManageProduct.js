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
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
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
        setSuccess(`Product "${productName}" deleted successfully!`);
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.message);
        setTimeout(() => setError(null), 3000);
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
        }, 3000);
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
                  <div style={{ position: 'relative', marginLeft: '8px' }}>
                    {error && <div className="notification error" style={{ top: '-60px' }}>{error}</div>}
                    {success && <div className="notification success" style={{ top: '-60px' }}>{success}</div>}
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ marginLeft: '8px', fontSize: '0.85rem', fontWeight: '500', padding: '6px 12px' }}
                      onClick={() => setShowModal(true)}
                    >
                      Add New Product
                    </button>
                  </div>
                </div>
                <table className="table products-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Name</th>
                      <th style={{ width: '20%' }}>Unit</th>
                      <th style={{ width: '20%' }}>Price Per Unit</th>
                      <th style={{ width: '20%' }}>Action</th>
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
                            style={{ fontSize: '0.75rem', fontWeight: '500', width: '60px' }}
                            onClick={() => handleUpdate(product)}
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ fontSize: '0.75rem', fontWeight: '500', width: '60px' }}
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