import mysql.connector

try:
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='***REDACTED_PWD***',
        database='carrerportal'
    )
    cursor = conn.cursor()
    # Correct Bcrypt Hash for Admin@123
    hash_val = '$2b$12$ejFKg7hc.Ws6T/FB5YFLSukAB2m7sd2UojUjqymW5PncChuXoRl1.'
    cursor.execute('UPDATE users SET password_hash = %s WHERE email = %s', (hash_val, 'admin@carrerportal.com'))
    conn.commit()
    print('Admin password hash successfully fixed!')
    
    # Let's also verify it printed correctly
    cursor.execute('SELECT password_hash FROM users WHERE email = %s', ('admin@carrerportal.com',))
    row = cursor.fetchone()
    print(f'Verified Database Hash: {row[0]}')
    
    cursor.close()
    conn.close()
except Exception as e:
    print(f'Error: {e}')
