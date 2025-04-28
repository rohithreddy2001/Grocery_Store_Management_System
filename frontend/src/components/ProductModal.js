// ProductModal.js
import React, { useState, useEffect } from 'react';

const API_BASE_URL = "https://grocery-store-management-system.onrender.com";

function ProductModal({ onClose, onSave, product }) {
  const isUpdateMode = !!product;
  const [formData, setFormData] = useState({
    name: product ? product.name : '',
    uom_id: product ? product.uom_id : '',
    price_per_unit: product ? product.price_per_unit : '',
    product_id: product ? product.product_id : ''
  });
  const [uoms, setUoms] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/getUOM`, { mode: 'cors' })
      .then(response => response.json())
      .then(data => setUoms(data))
      .catch(error => console.error('Error fetching UOMs:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const requestPayload = {
      product_name: formData.name,
      uom_id: formData.uom_id,
      price_per_unit: formData.price_per_unit,
      ...(isUpdateMode && { product_id: formData.product_id })
    };
    const endpoint = isUpdateMode ? 'updateProduct' : 'insertProduct';
    fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${JSON.stringify(requestPayload)}`
    })
      .then(() => {
        onSave();
      })
      .catch(error => console.error(`Error ${isUpdateMode ? 'updating' : 'saving'} product:`, error));
  };

  return (
    <div className="modal fade-scale show" role="dialog" data-backdrop="static">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{isUpdateMode ? 'Update Product' : 'Add New Product'}</h4>
          </div>
          <div className="modal-body">
            <form id="productForm">
              <input type="hidden" name="id" value={formData.product_id} />
              <div className="form-group">
                <label>Name</label>
                <input
                  className="form-control"
                  placeholder="Product Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select
                  name="uom_id"
                  className="form-control"
                  value={formData.uom_id}
                  onChange={handleChange}
                >
                  <option value="">Select Unit</option>
                  {uoms.map(uom => (
                    <option key={uom.uom_id} value={uom.uom_id}>
                      {uom.uom_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price Per Unit</label>
                <input
                  className="form-control"
                  placeholder="Price Per Unit"
                  name="price_per_unit"
                  type="text"
                  value={formData.price_per_unit}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              {isUpdateMode ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;