import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔌 Setting up database connection for students...');
console.log('📋 Database config:', {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  database: process.env.MYSQLDATABASE, // Should be 'students'
  port: process.env.MYSQLPORT
});

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE, // Use the environment variable
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL on Railway');
    console.log('📊 Database:', process.env.MYSQLDATABASE);
    connection.release();
  }
});

export default pool;
