import mysql.connector
from mysql.connector import Error
import os

__cnx = None

def get_sql_connection():
    global __cnx
    print("Attempting to get MySQL connection")  # Debug
    try:
        # Check if connection exists and is valid
        if __cnx is not None and __cnx.is_connected():
            print("Reusing existing MySQL connection")  # Debug
            return __cnx

        # If connection is None or not connected, establish a new one
        print("Opening new MySQL connection")  # Debug
        __cnx = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "Rohith18#"),
            database=os.getenv("DB_NAME", "grocery_store")
        )
        if __cnx.is_connected():
            print("Successfully connected to MySQL database")  # Debug
        else:
            print("Failed to verify new connection")  # Debug
            __cnx = None
        return __cnx
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")  # Debug
        __cnx = None  # Reset connection on failure
        return None

def close_sql_connection():
    global __cnx
    if __cnx and __cnx.is_connected():
        try:
            __cnx.close()
            print("MySQL connection closed")  # Debug
        except Error as e:
            print(f"Error closing MySQL connection: {e}")  # Debug
        finally:
            __cnx = None  # Reset connection