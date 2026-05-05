const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabases() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });
  
  console.log('\n--- Available Databases ---');
  try {
    const [rows] = await connection.execute(`SHOW DATABASES`);
    rows.forEach(row => {
      console.log(`- ${row.Database}`);
    });
  } catch (err) {
    console.log(`Error showing databases: ${err.message}`);
  }
  
  await connection.end();
}

checkDatabases();
