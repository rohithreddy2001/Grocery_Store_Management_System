from flask import Flask, request, jsonify
from flask_cors import CORS
from sql_connection import get_sql_connection, close_sql_connection
import json
import traceback
import os

# Import DAOs
import products_dao
import orders_dao
import uom_dao

app = Flask(__name__)
# Enable CORS for the Vercel frontend domain with explicit debug
CORS(app, resources={r"/*": {"origins": "https://grocery-store-management-system-livid.vercel.app"}}, supports_credentials=True)

@app.route('/getUOM', methods=['GET'])
def get_uom():
    response = {}
    connection = get_sql_connection()
    print(f"Connection status for getUOM: {connection is not None and connection.is_connected()}")  # Debug
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        print(f"Database connection failed in getUOM: {response['message']}")  # Debug
        return jsonify(response), 500
    try:
        print("Fetching UOMs via uom_dao.get_uoms")  # Debug
        response = uom_dao.get_uoms(connection)
        print(f"UOM response: {response}")  # Debug response
        return jsonify(response)
    except Exception as e:
        response['message'] = f"Error in get_uom: {str(e)}"
        print(f"Error in get_uom: {str(e)} - Traceback: {traceback.format_exc()}")  # Enhanced debug
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()
            print("Connection closed in getUOM")  # Debug

@app.route('/getProducts', methods=['GET'])
def get_products():
    response = {}
    connection = get_sql_connection()
    print(f"Connection status for getProducts: {connection is not None and connection.is_connected()}")  # Debug
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        print(f"Database connection failed in getProducts: {response['message']}")  # Debug
        return jsonify(response), 500
    try:
        print("Fetching products via products_dao.get_all_products")  # Debug
        response = products_dao.get_all_products(connection)
        print(f"Products response: {response}")  # Debug response
        if not isinstance(response, (list, dict)):
            response = {'message': 'Invalid response format from get_all_products'}
            return jsonify(response), 500
        return jsonify(response)
    except Exception as e:
        response['message'] = f"Error in get_products: {str(e)}"
        print(f"Error in get_products: {str(e)} - Traceback: {traceback.format_exc()}")  # Enhanced debug
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()
            print("Connection closed in getProducts")  # Debug

@app.route('/insertProduct', methods=['POST'])
def insert_product():
    response = {}
    connection = get_sql_connection()
    print(f"Connection status: {connection is not None and connection.is_connected()}")  # Debug connection
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        print(f"Database connection failed: {response['message']}")  # Debug
        return jsonify(response), 500
    try:
        request_payload = json.loads(request.form['data'])
        product_id = products_dao.insert_new_product(connection, request_payload)
        response = {'product_id': product_id}
        return jsonify(response)
    except Exception as e:
        response['message'] = str(e)
        print(f"Error in insert_product: {e} - Traceback: {traceback.format_exc()}")  # Enhanced debug
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()
            print("Connection closed")  # Debug

@app.route('/updateProduct', methods=['POST'])
def update_product():
    response = {}
    connection = get_sql_connection()
    print(f"Connection status: {connection is not None and connection.is_connected()}")  # Debug connection
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        print(f"Database connection failed: {response['message']}")  # Debug
        return jsonify(response), 500
    try:
        request_payload = json.loads(request.form['data'])
        product_id = products_dao.update_product(connection, request_payload)
        response = {'product_id': product_id}
        return jsonify(response)
    except Exception as e:
        response['message'] = str(e)
        print(f"Error in update_product: {e} - Traceback: {traceback.format_exc()}")  # Enhanced debug
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()
            print("Connection closed")  # Debug

@app.route('/getAllOrders', methods=['GET'])
def get_all_orders():
    response = {}
    connection = get_sql_connection()
    print(f"Connection status: {connection is not None and connection.is_connected()}")  # Debug connection
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        print(f"Database connection failed: {response['message']}")  # Debug
        return jsonify(response), 500
    try:
        response = orders_dao.get_all_orders(connection)
        print(f"Returning orders: {response}")  # Debug
        return jsonify(response)
    except Exception as e:
        print(f"Error fetching orders: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        response['message'] = str(e)
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()
            print("Connection closed")  # Debug

@app.route('/insertOrder', methods=['POST'])
def insert_order():
    response = {}
    connection = get_sql_connection()
    print(f"Connection status for insertOrder: {connection is not None and connection.is_connected()}")  # Debug
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        print(f"Database connection failed in insertOrder: {response['message']}")  # Debug
        return jsonify(response), 500
    try:
        data = request.form.get('data')
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        request_payload = json.loads(data)
        print(f"Received order data: {request_payload}")  # Debug
        order_id = orders_dao.insert_order(connection, request_payload)
        print(f"Order saved with ID: {order_id}")  # Debug
        response = {'message': 'Order saved successfully', 'order_id': order_id}
        connection.commit()  # Explicit commit to ensure data is saved
        print("Transaction committed in insertOrder")  # Debug
        return jsonify(response)
    except Exception as e:
        print(f"Error saving order: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        connection.rollback()
        print("Transaction rolled back in insertOrder")  # Debug
        response['message'] = str(e)
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()
            print("Connection closed in insertOrder")  # Debug

@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    response = {}
    connection = get_sql_connection()
    print(f"Connection status: {connection is not None and connection.is_connected()}")  # Debug connection
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        print(f"Database connection failed: {response['message']}")  # Debug
        return jsonify(response), 500
    try:
        return_id = products_dao.delete_product(connection, request.form['product_id'])
        response = {'product_id': return_id}
    except products_dao.DeletionError as e:
        response = {'error': str(e)}
        return jsonify(response), 400
    except Exception as e:
        response['message'] = str(e)
        print(f"Error in delete_product: {e} - Traceback: {traceback.format_exc()}")  # Enhanced debug
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()
            print("Connection closed")  # Debug
        return jsonify(response)

# Add this at the bottom to handle app shutdown
@app.teardown_appcontext
def shutdown_session(exception=None):
    close_sql_connection()
    print("App context shutdown, connection closed")  # Debug

if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)  # Enable debug mode for more logs