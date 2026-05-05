const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugQuery() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });
  
  const userId = '422a618e-65ca-4621-a9f9-6ce819a9af0c';
  
  console.log(`\n--- Testing query for wishlist_items ---`);
  try {
    const [rows] = await connection.execute(
      'select `id`, `userId`, `productId`, `createdAt` from `wishlist_items` where `wishlist_items`.`userId` = ?',
      [userId]
    );
    console.log('Success!', rows.length, 'items found.');
  } catch (err) {
    console.log('QUERY FAILED!');
    console.log('Error Code:', err.code);
    console.log('Error Message:', err.message);
    console.log('Error Stack:', err.stack);
  }
  
  await connection.end();
}

debugQuery();
