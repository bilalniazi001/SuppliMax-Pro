const { Client } = require('pg');

async function createAdmin() {
  const connectionString = 'postgresql://postgres:supplimax123@127.0.0.1:5432/supplimax';
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const name = 'SuppliMax Admin';
    const email = 'admin@supplimax.com';
    const password = 'admin123';
    const role = 'admin';

    const checkQuery = 'SELECT id FROM users WHERE email = $1';
    const checkRes = await client.query(checkQuery, [email]);

    if (checkRes.rows.length > 0) {
      console.log('Admin user exists, updating password...');
      const updateQuery = 'UPDATE users SET password = $1, role = $2 WHERE email = $3';
      await client.query(updateQuery, [password, role, email]);
      console.log('✅ Admin password updated successfully!');
    } else {
      const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)';
      await client.query(insertQuery, [name, email, password, role]);
      console.log('✅ Admin user created successfully!');
      console.log('Email: ' + email);
      console.log('Password: ' + password);
    }
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  } finally {
    await client.end();
  }
}

createAdmin();
