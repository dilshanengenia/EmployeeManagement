import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EmsBackend.settings')
django.setup()

from django.db import connection

def describe_table(table_name):
    with connection.cursor() as cursor:
        cursor.execute(f"DESCRIBE {table_name}")
        columns = cursor.fetchall()
        print(f"\n{table_name.upper()} table structure:")
        print("-" * 50)
        for column in columns:
            print(f"  {column[0]} - {column[1]} {'(NULL)' if column[2] == 'YES' else '(NOT NULL)'}")

# Check the structure of key tables
try:
    describe_table('users')
    describe_table('usertypes')
    
    # Check if employees table exists
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES LIKE 'employees'")
        if cursor.fetchone():
            describe_table('employees')
        else:
            print("\nEMPLOYEES table does not exist")
            
except Exception as e:
    print(f"Error: {e}")
