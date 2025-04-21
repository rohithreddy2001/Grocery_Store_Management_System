from datetime import datetime
from sql_connection import get_sql_connection
import traceback

def insert_order(connection, order):
    cursor = connection.cursor()
    print(f"Inserting order for customer: {order['customer_name']}, total: {order['grand_total']}")  # Debug
    print(f"Order details to insert: {order['order_details']}")  # Debug

    order_query = ("INSERT INTO orders "
                   "(customer_name, total, datetime)"
                   "VALUES (%s, %s, %s)")
    order_data = (order['customer_name'], order['grand_total'], datetime.now())

    cursor.execute(order_query, order_data)
    order_id = cursor.lastrowid

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
    try:
        cursor.executemany(order_details_query, order_details_data)
        rows_affected = cursor.rowcount
        print(f"Rows inserted into order_details: {rows_affected}")  # Debug
        if rows_affected != len(order_details_data):
            print(f"Warning: Expected {len(order_details_data)} rows, inserted {rows_affected}")
    except Exception as e:
        print(f"Error inserting order_details: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        connection.rollback()
        raise

    connection.commit()

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
    for (order_id, quantity, total_price, product_name, price_per_unit, uom_name) in cursor:
        # Recalculate total_price based on latest price_per_unit
        recalculated_total = quantity * price_per_unit if quantity and price_per_unit else 0.0
        records.append({
            'order_id': order_id,
            'quantity': quantity,
            'total_price': recalculated_total,  # Use recalculated value
            'product_name': product_name,
            'price_per_unit': price_per_unit,
            'uom_name': uom_name
        })

    cursor.close()
    print(f"Order details for order_id {order_id}: {records}")  # Debug
    print(f"Number of details records fetched: {len(records)}")  # Debug

    return records

def get_all_orders(connection):
    cursor = connection.cursor()
    query = ("SELECT o.order_id, o.customer_name, o.datetime, o.total AS original_total "
             "FROM orders o "
             "ORDER BY o.order_id")
    cursor.execute(query)
    results = cursor.fetchall()

    orders = {}
    for row in results:
        order_id, customer_name, dt, original_total = row
        orders[order_id] = {
            'order_id': order_id,
            'customer_name': customer_name,
            'datetime': dt,
            'total': 0.0,  # Will be recalculated
            'order_details': []
        }

    # Fetch and recalculate order details
    for order_id in orders.keys():
        details = get_order_details(connection, order_id)
        orders[order_id]['order_details'] = details
        # Recalculate total based on latest detail totals
        total = sum(detail['total_price'] for detail in details)
        orders[order_id]['total'] = total

    response = list(orders.values())
    print(f"All orders with recalculated totals: {response}")  # Debug
    return response

if __name__ == '__main__':
    connection = get_sql_connection()
    print(get_all_orders(connection))