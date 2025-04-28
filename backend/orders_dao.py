from datetime import datetime
from sql_connection import get_sql_connection
import traceback
import pytz

def insert_order(connection, order):
    cursor = connection.cursor()
    print(f"Inserting order for customer: {order['customer_name']}, total: {order['grand_total']}")  # Debug
    print(f"Order details to insert: {order['order_details']}")  # Debug

    try:
        # Explicitly set the session timezone to IST (+05:30)
        cursor.execute("SET SESSION time_zone = '+05:30'")
        print("Set MySQL session timezone to IST (+05:30)")  # Debug

        # Get the current time in IST
        ist = pytz.timezone('Asia/Kolkata')
        order_date = datetime.now(ist)
        print(f"IST datetime to insert: {order_date}")  # Debug

        order_query = ("INSERT INTO orders "
                       "(customer_name, total, datetime)"
                       "VALUES (%s, %s, %s)")
        order_data = (order['customer_name'], order['grand_total'], order_date)

        cursor.execute(order_query, order_data)
        order_id = cursor.lastrowid
        print(f"Inserted order with ID: {order_id}, datetime: {order_date}")  # Debug

        order_details_query = ("INSERT INTO order_details "
                               "(order_id, product_id, quantity, uom_id, total_price)"
                               "VALUES (%s, %s, %s, %s, %s)")

        order_details_data = []
        for order_detail_record in order['order_details']:
            order_details_data.append([
                order_id,
                int(order_detail_record['product_id']),
                float(order_detail_record['quantity']),
                int(order_detail_record.get('uom_id', 1)),  # Default to 1 if not provided
                float(order_detail_record['total_price'])
            ])
        print(f"Executing order_details insert: {order_details_data}")  # Debug
        cursor.executemany(order_details_query, order_details_data)
        rows_affected = cursor.rowcount
        print(f"Rows inserted into order_details: {rows_affected}")  # Debug
        if rows_affected != len(order_details_data):
            print(f"Warning: Expected {len(order_details_data)} rows, inserted {rows_affected}")

        connection.commit()
        print("Transaction committed successfully")  # Debug

    except Exception as e:
        print(f"Error inserting order: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        connection.rollback()
        raise
    finally:
        cursor.close()

    return order_id

def get_order_details(connection, order_id):
    cursor = connection.cursor()

    query = ("SELECT order_details.order_id, order_details.quantity, order_details.total_price, "
             "products.name, products.price_per_unit, uom.uom_name "
             "FROM order_details "
             "LEFT JOIN products ON order_details.product_id = products.product_id "
             "LEFT JOIN uom ON order_details.uom_id = uom.uom_id "
             "WHERE order_details.order_id = %s")

    cursor.execute(query, (order_id,))
    records = []
    for (order_id, quantity, total_price, product_name, current_price_per_unit, uom_name) in cursor:
        quantity = float(quantity) if quantity is not None else 0.0
        total_price = float(total_price) if total_price is not None else 0.0
        # Calculate historical price_per_unit from total_price / quantity
        historical_price_per_unit = (total_price / quantity) if quantity > 0 else 0.0
        records.append({
            'order_id': order_id,
            'quantity': quantity,
            'total_price': total_price,  # Use stored total_price
            'product_name': product_name,
            'price_per_unit': historical_price_per_unit,  # Use historical price
            'uom_name': uom_name
        })

    cursor.close()
    print(f"Order details for order_id {order_id}: {records}")  # Debug
    print(f"Number of details records fetched: {len(records)}")  # Debug

    return records

def get_all_orders(connection):
    cursor = connection.cursor()
    query = ("SELECT o.order_id, o.customer_name, o.datetime, o.total "
             "FROM orders o "
             "ORDER BY o.order_id")
    cursor.execute(query)
    results = cursor.fetchall()

    orders = {}
    for row in results:
        order_id, customer_name, dt, total = row
        orders[order_id] = {
            'order_id': order_id,
            'customer_name': customer_name,
            'datetime': dt,
            'total': float(total) if total is not None else 0.0,  # Use stored total
            'order_details': []
        }

    # Fetch order details
    for order_id in orders.keys():
        details = get_order_details(connection, order_id)
        orders[order_id]['order_details'] = details

    response = list(orders.values())
    print(f"All orders with stored totals: {response}")  # Debug
    return response

if __name__ == '__main__':
    connection = get_sql_connection()
    print(get_all_orders(connection))