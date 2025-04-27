import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';

const API_BASE_URL = "https://grocery-store-management-system.onrender.com";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  useEffect(() => {
    fetch(`${API_BASE_URL}/getProducts`)
      .then(response => response.json())
      .then(data => setProducts(data || [])) // Ensure data is an array
      .catch(error => console.error('Error fetching products:', error));
  }, []);

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
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred while deleting the product.');
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
    fetch(`${API_BASE_URL}/getProducts`)
      .then(response => response.json())
      .then(data => setProducts(data || [])) // Ensure data is an array
      .catch(error => console.error('Error fetching products:', error));
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="right content-page">
      <div className="body content rows scroll-y">
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