import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';

const API_BASE_URL = "https://grocery-store-management-system.onrender.com";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productResponse = await fetch(`${API_BASE_URL}/getProducts`, { mode: 'cors' });
        if (!productResponse.ok) throw new Error('Failed to fetch products');
        const productData = await productResponse.json();
        setProducts(productData);
        setFilteredProducts(productData);

        const uomResponse = await fetch(`${API_BASE_URL}/getUOM`, { mode: 'cors' });
        if (!uomResponse.ok) throw new Error('Failed to fetch UOMs');
        const uomData = await uomResponse.json();
        setUoms(uomData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Automatic search on input change
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/deleteProduct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${JSON.stringify({ product_id: productId })}`
        });
        if (!response.ok) throw new Error('Failed to delete product');
        setProducts(products.filter(product => product.product_id !== productId));
        setFilteredProducts(filteredProducts.filter(product => product.product_id !== productId));
        setSuccess('Product deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleSaveProduct = async () => {
    setShowModal(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getProducts`, { mode: 'cors' });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false); // Set loading to false immediately after data is received
      setSuccess(selectedProduct ? 'Product updated successfully!' : 'Product added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setLoading(false); // Ensure loading stops even on error
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="right content-page">
      <div className="body content rows scroll-y">
        <div className="box-info full">
          <h2>Manage Products</h2>
          {error && <div className="notification error">{error}</div>}
          {success && <div className="notification success">{success}</div>}
          <div className="row">
            <div className="col-sm-9">
              <div className="form-group">
                <label>Search by Product Name - {filteredProducts.length + (filteredProducts.length > 1 ? " Products Found" : " Product Found")}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ maxWidth: '600px' }}
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group pull-right">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAddProduct}
                >
                  Add New Product
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="table-container">
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
                            onClick={() => handleUpdate(product)}
                          >
                            Update
                          </button>
                           
                          <button
                            type="button"
                            className="btn btn-xs btn-danger"
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
          {loading && <div className="loading">Loading...</div>}
          {showModal && (
            <ProductModal
              onClose={() => setShowModal(false)}
              onSave={handleSaveProduct}
              product={selectedProduct}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageProduct;