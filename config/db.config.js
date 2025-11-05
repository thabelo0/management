/*
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

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
        return;
      }
      console.log('Successfully connected to the MySQL database.');
    });

    connection.on('error', (err) => {
      console.error('Database error event:', err.code, err.message);
    });

    return connection;

  } catch (e) {
    console.error('Environment validation or connection setup failed:', e.message);
  }
}


const db = connectDatabase();

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
