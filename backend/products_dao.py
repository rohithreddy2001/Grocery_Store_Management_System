from sql_connection import get_sql_connection

class DeletionError(Exception):
    pass

# def get_all_products(connection):
#     cursor = connection.cursor()
#     query = ("select products.product_id, products.name, products.uom_id, products.price_per_unit, uom.uom_name from products inner join uom on products.uom_id=uom.uom_id order by products.name asc")
#     cursor.execute(query)
#     response = []
#     for (product_id, name, uom_id, price_per_unit, uom_name) in cursor:
#         response.append({
#             'product_id': product_id,
#             'name': name,
#             'uom_id': uom_id,
#             'price_per_unit': price_per_unit,
#             'uom_name': uom_name
#         })
#     return response

def get_all_products(connection):
    cursor = None
    try:
        print("Executing get_all_products query")  # Debug
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT p.product_id, p.name, p.uom_id, p.price_per_unit, u.uom_name
            FROM products p
            LEFT JOIN uom u ON p.uom_id = u.uom_id order by p.name asc
        """
        print(f"Executing query: {query}")  # Debug query
        cursor.execute(query)
        result = cursor.fetchall()
        print(f"Query result: {result}")  # Debug result
        return result
    except Exception as e:
        print(f"Error in get_all_products: {str(e)} - Traceback: {traceback.format_exc()}")  # Debug
        raise e
    finally:
        if cursor:
            cursor.close()
            print("Cursor closed in get_all_products")  # Debug

def insert_new_product(connection, product):
    cursor = connection.cursor()
    query = ("INSERT INTO products "
             "(name, uom_id, price_per_unit)"
             "VALUES (%s, %s, %s)")
    data = (product['product_name'], product['uom_id'], product['price_per_unit'])

    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def delete_product(connection, product_id):
    cursor = connection.cursor()
    # Check for dependent records in order_details
    check_query = ("SELECT COUNT(*) FROM order_details WHERE product_id = %s")
    cursor.execute(check_query, (product_id,))
    count = cursor.fetchone()[0]
    
    if count > 0:
        raise DeletionError(f"Can't delete id: {product_id} as it is referenced in orders.")
    
    # Proceed with deletion if no dependencies
    query = ("DELETE FROM products WHERE product_id = %s")
    cursor.execute(query, (product_id,))
    connection.commit()

    return cursor.lastrowid

def update_product(connection, product):
    cursor = connection.cursor()
    query = ("UPDATE products "
             "SET name=%s, uom_id=%s, price_per_unit=%s "
             "WHERE product_id=%s")
    data = (product['product_name'], product['uom_id'], product['price_per_unit'], product['product_id'])

    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

if __name__ == '__main__':
    connection = get_sql_connection()
    # print(get_all_products(connection))
    print(insert_new_product(connection, {
        'product_name': 'potatoes',
        'uom_id': '1',
        'price_per_unit': 10
    }))