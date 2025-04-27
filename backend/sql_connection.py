import mysql.connector
from mysql.connector import Error
import os

__cnx = None

def get_sql_connection():
    global __cnx
    print("Attempting to get MySQL connection")

    try:
        if __cnx is None or not __cnx.is_connected():
            print("Opening new MySQL connection")
            __cnx = mysql.connector.connect(
                host=os.getenv("DB_HOST", "localhost"),
                port=int(os.getenv("DB_PORT", 3306)),  # Add port with default 3306
                user=os.getenv("DB_USER", "root"),
                password=os.getenv("DB_PASSWORD", "Rohith18#"),
                database=os.getenv("DB_NAME", "grocery_store")
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