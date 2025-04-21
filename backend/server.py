# from flask import Flask, request, jsonify
# from sql_connection import get_sql_connection
# import mysql.connector
# import json

# import products_dao
# import orders_dao
# import uom_dao

# app = Flask(__name__)

# connection = get_sql_connection()

# @app.route('/getUOM', methods=['GET'])
# def get_uom():
#     response = uom_dao.get_uoms(connection)
#     response = jsonify(response)
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

# @app.route('/getProducts', methods=['GET'])
# def get_products():
#     response = products_dao.get_all_products(connection)
#     response = jsonify(response)
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

# @app.route('/insertProduct', methods=['POST'])
# def insert_product():
#     request_payload = json.loads(request.form['data'])
#     product_id = products_dao.insert_new_product(connection, request_payload)
#     response = jsonify({
#         'product_id': product_id
#     })
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

# @app.route('/updateProduct', methods=['POST'])
# def update_product():
#     request_payload = json.loads(request.form['data'])
#     product_id = products_dao.update_product(connection, request_payload)
#     response = jsonify({
#         'product_id': product_id
#     })
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

# @app.route('/getAllOrders', methods=['GET'])
# def get_all_orders():
#     response = orders_dao.get_all_orders(connection)
#     response = jsonify(response)
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

# @app.route('/insertOrder', methods=['POST'])
# def insert_order():
#     request_payload = json.loads(request.form['data'])
#     order_id = orders_dao.insert_order(connection, request_payload)
#     response = jsonify({
#         'order_id': order_id
#     })
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response



# @app.route('/deleteProduct', methods=['POST'])
# def delete_product():
#     try:
#         return_id = products_dao.delete_product(connection, request.form['product_id'])
#         response = jsonify({
#             'product_id': return_id
#         })
#     except products_dao.DeletionError as e:
#         response = jsonify({
#             'error': str(e)
#         })
#         response.status_code = 400
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

# if __name__ == "__main__":
#     print("Starting Python Flask Server For Grocery Store Management System")
#     app.run(debug=True, port=5000)

# ---------------------------------

# backend/server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from sql_connection import get_sql_connection, close_sql_connection
import json
import traceback

import products_dao
import orders_dao
import uom_dao

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/getUOM', methods=['GET'])
def get_uom():
    response = {}
    connection = get_sql_connection()
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        return jsonify(response), 500
    try:
        response = uom_dao.get_uoms(connection)
        return jsonify(response)
    except Exception as e:
        response['message'] = str(e)
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()

@app.route('/getProducts', methods=['GET'])
def get_products():
    response = {}
    connection = get_sql_connection()
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        return jsonify(response), 500
    try:
        response = products_dao.get_all_products(connection)
        return jsonify(response)
    except Exception as e:
        response['message'] = str(e)
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()

@app.route('/insertProduct', methods=['POST'])
def insert_product():
    response = {}
    connection = get_sql_connection()
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        return jsonify(response), 500
    try:
        request_payload = json.loads(request.form['data'])
        product_id = products_dao.insert_new_product(connection, request_payload)
        response = {'product_id': product_id}
        return jsonify(response)
    except Exception as e:
        response['message'] = str(e)
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()

@app.route('/updateProduct', methods=['POST'])
def update_product():
    response = {}
    connection = get_sql_connection()
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        return jsonify(response), 500
    try:
        request_payload = json.loads(request.form['data'])
        product_id = products_dao.update_product(connection, request_payload)
        response = {'product_id': product_id}
        return jsonify(response)
    except Exception as e:
        response['message'] = str(e)
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()

@app.route('/getAllOrders', methods=['GET'])
def get_all_orders():
    response = {}
    connection = get_sql_connection()
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
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

@app.route('/insertOrder', methods=['POST'])
def insert_order():
    response = {}
    connection = get_sql_connection()
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
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
        return jsonify(response)
    except Exception as e:
        print(f"Error saving order: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        connection.rollback()
        response['message'] = str(e)
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()

@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    response = {}
    connection = get_sql_connection()
    if not connection or not connection.is_connected():
        response['message'] = "Failed to connect to the database"
        return jsonify(response), 500
    try:
        return_id = products_dao.delete_product(connection, request.form['product_id'])
        response = {'product_id': return_id}
    except products_dao.DeletionError as e:
        response = {'error': str(e)}
        return jsonify(response), 400
    except Exception as e:
        response['message'] = str(e)
        return jsonify(response), 500
    finally:
        if connection and connection.is_connected():
            close_sql_connection()
        return jsonify(response)

# Add this at the bottom to handle app shutdown
@app.teardown_appcontext
def shutdown_session(exception=None):
    close_sql_connection()

if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(debug=True, port=5000)