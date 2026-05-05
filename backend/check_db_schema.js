const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });
  
  const tables = ['users', 'products', 'orders', 'order_items', 'cart_items', 'wishlist_items'];
  
  for (const table of tables) {
    console.log(`\n--- Columns for table: ${table} ---`);
    try {
      const [rows] = await connection.execute(`DESCRIBE ${table}`);
      rows.forEach(row => {
        console.log(`- ${row.Field} (${row.Type})`);
      });
    } catch (err) {
      console.log(`Error describing ${table}: ${err.message}`);
    }
  }
  
  await connection.end();
}

checkSchema();
