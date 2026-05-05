const mysql = require('mysql2/promise');
require('dotenv').config();

async function testQuery() {
  const url = process.env.DATABASE_URL;
  console.log('Testing query on:', url);
  
  const connection = await mysql.createConnection({
    uri: url,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  try {
    const [rows] = await connection.execute('SELECT `id`, `name`, `category`, `price`, `rating`, `imageUrl`, `description`, `cost`, `quantityInStock`, `size`, `color`, `onSale`, `discountPercentage`, `isNewArrival`, `isInStock`, `isFeatured`, `isExclusive`, `createdAt`, `updatedAt` FROM `products`');
    console.log('✅ Query success! Total products:', rows.length);
    
    const [userRows] = await connection.execute('SELECT `id`, `name`, `email`, `password`, `role`, `age`, `phone`, `address`, `city`, `country`, `postalCode`, `nationality`, `cnic`, `createdAt`, `updatedAt` FROM `users`');
    console.log('✅ Query success! Total users:', userRows.length);
  } catch (err) {
    console.error('❌ Query failed:', err.message);
    console.error(err);
  } finally {
    await connection.end();
  }
}

testQuery();
