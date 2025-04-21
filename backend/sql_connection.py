import mysql.connector
from mysql.connector import Error

__cnx = None

def get_sql_connection():
    global __cnx
    print("Attempting to get MySQL connection")

    try:
        if __cnx is None or not __cnx.is_connected():
            print("Opening new MySQL connection")
            __cnx = mysql.connector.connect(
                host="localhost",  
                user="root",
                password="Rohith18#",
                database="grocery_store"
                # connection_timeout=60  # Optional: Set a timeout
            )
            if __cnx.is_connected():
                print("Successfully connected to MySQL database")
            else:
                print("Failed to verify new connection")
                __cnx = None
        else:
            print("Reusing existing MySQL connection")
        return __cnx
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        __cnx = None
        return None

def close_sql_connection():
    global __cnx
    if __cnx and __cnx.is_connected():
        __cnx.close()
        print("MySQL connection closed")
        __cnx = None

# Optional: Call close_sql_connection when the app shuts down
# This can be integrated with Flask's teardown mechanism