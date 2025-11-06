/*
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Validate environment variables first
function validateEnv() {
  const requiredVars = ['MYSQLHOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'];
  for (const v of requiredVars) {
    if (!process.env[v]) {
      throw new Error(`Missing environment variable ${v}`);
    }
  }
  console.log('All required environment variables are present.');
}

console.log('MYSQLHOST:', process.env.MYSQLHOST);
if (!process.env.MYSQLHOST) throw new Error('Missing MYSQLHOST env var');


// Create and connect database with enhanced error handling
function connectDatabase() {
  try {
    validateEnv();

    const connection = mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT || 3306,
    });

    connection.connect((err) => {
      if (err) {
        console.error('Connection error:', err.code, err.message);
        return; // You can also throw or exit here
      }
      console.log('Successfully connected to the MySQL database.');
    });

    connection.on('error', (err) => {
      console.error('Database error event:', err.code, err.message);
      // Handle reconnection logic or shutdown here if needed
    });

    return connection;

  } catch (e) {
    console.error('Environment validation or connection setup failed:', e.message);
    // Exit or handle error further if required
  }
}

// Usage
const db = connectDatabase();

// Example query with error handling
if (db) {
  db.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Query error:', err.code, err.message);
    } else {
      console.log('Query success:', results);
    }
  });
}

*/