import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Order() {
  const [customerName, setCustomerName] = useState('');
  const [products, setProducts] = useState([]);
  const [uoms, setUoms] = useState([]); // Initialize as empty array
  const [productPrices, setProductPrices] = useState({});
  const [items, setItems] = useState([
    { product_id: '', quantity: 1, uom_id: '', price: 0, total: 0 }
  ]);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    // Fetch products
    fetch('http://127.0.0.1:5000/getProducts') // Use full URL
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched products:', data); // Debug
        if (Array.isArray(data)) {
          setProducts(data);
          const prices = {};
          data.forEach(product => {
            prices[product.product_id] = product.price_per_unit;
          });
          setProductPrices(prices);
        } else {
          console.error('Products data is not an array:', data);
          setProducts([]);
          setProductPrices({});
        }
      })
      .catch(error => console.error('Error fetching products:', error));

    // Fetch UOMs
    fetch('http://127.0.0.1:5000/getUOM') // Use full URL
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched UOMs:', data); // Debug
        if (Array.isArray(data)) {
          setUoms(data);
        } else {
          console.error('UOMs data is not an array:', data);
          setUoms([]); // Ensure uoms is always an array
        }
      })
      .catch(error => {
        console.error('Error fetching UOMs:', error);
        setUoms([]); // Ensure uoms is always an array on error
      });
  }, []);

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 1, uom_id: '', price: 0, total: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateGrandTotal(newItems);
  };

  const handleProductChange = (index, product_id) => {
    const newItems = [...items];
    newItems[index].product_id = product_id;
    newItems[index].price = productPrices[product_id] || 0;
    newItems[index].total = newItems[index].price * newItems[index].quantity;
    setItems(newItems);
    calculateGrandTotal(newItems);
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...items];
    newItems[index].quantity = parseFloat(quantity) || 1;
    newItems[index].total = newItems[index].price * newItems[index].quantity;
    setItems(newItems);
    calculateGrandTotal(newItems);
  };

  const handleUomChange = (index, uom_id) => {
    const newItems = [...items];
    newItems[index].uom_id = uom_id;
    setItems(newItems);
  };

  const calculateGrandTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
    setGrandTotal(total);
  };

  const handleSaveOrder = () => {
    if (items.some(item => !item.product_id || item.quantity <= 0 || !item.uom_id)) {
      alert('Please complete all product and UOM details.');
      return;
    }
    const requestPayload = {
      customer_name: customerName,
      grand_total: grandTotal,
      order_details: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        uom_id: item.uom_id,
        total_price: item.total
      }))
    };
    console.log('Saving order:', requestPayload); // Debug: Log payload
    fetch('http://127.0.0.1:5000/insertOrder', { // Use full URL
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${JSON.stringify(requestPayload)}`
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to save order');
        return response.json();
      })
      .then(data => {
        console.log('Server response:', data); // Debug: Log response
        window.location.reload(); // Trigger reload
      })
      .catch(error => console.error('Error saving order:', error));
  };

  return (
    <div className="right content-page">
      <div className="body content rows scroll-y">
        <div className="box-info full" id="taskOrderContainer">
          <div className="new-order-header">
            <h2>New Order</h2>
            <Link to="/">
              <button
                type="button"
                className="btn btn-xs btn-danger"
                style={{ marginLeft: '0px', fontSize: '14px', fontWeight: '500' }}
              >
                Exit Page
              </button>
            </Link>
          </div>
          <form>
            <div className="form-section">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  name="customerName"
                  type="text"
                  className="form-control"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-section product-section">
              <div className="product-header">
                <h3>Products</h3>
                <button
                  className="btn btn-sm btn-primary"
                  type="button"
                  onClick={addItem}
                >
                  Add Product
                </button>
              </div>
              <div className="product-rows">
                {items.map((item, index) => (
                  <div className="product-row" key={index}>
                    <div className="form-group">
                      <label>Product</label>
                      <select
                        name="product"
                        className="form-control"
                        value={item.product_id}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.product_id} value={product.product_id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Price (Rs)</label>
                      <input
                        name="product_price"
                        className="form-control product-price"
                        value={item.price.toFixed(2)}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        name="qty"
                        type="number"
                        min="1"
                        className="form-control product-qty"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                      />
                    </div>
                    &nbsp;
                    &nbsp;
                    <div className="form-group">
                      <label>Unit</label>
                      <select
                        name="uom"
                        className="form-control"
                        value={item.uom_id}
                        onChange={(e) => handleUomChange(index, e.target.value)}
                      >
                        <option value="">Select Unit</option>
                        {Array.isArray(uoms) && uoms.length > 0 ? (
                          uoms.map(uom => (
                            <option key={uom.uom_id} value={uom.uom_id}>
                              {uom.uom_name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Units available</option>
                        )}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Total (Rs)</label>
                      <input
                        name="item_total"
                        className="form-control product-total"
                        value={item.total.toFixed(2)}
                        readOnly
                      />
                    </div>
                    <div className="form-group product-row-actions">
                      <button
                        className="btn btn-sm btn-danger"
                        type="button"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section total-section">
              <div className="total-row">
                <div className="total-label">
                  <strong>Grand Total</strong>
                </div>
                <div className="total-value">
                  <input
                    id="product_grand_total"
                    name="product_grand_total"
                    className="form-control product-grand-total"
                    value={grandTotal.toFixed(2)}
                    readOnly
                  />
                  <span>Rs</span>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSaveOrder}
                >
                  Save Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Order;