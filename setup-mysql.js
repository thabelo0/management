import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || ''
});

async function setupMySQL() {
  try {
    console.log(' Connecting to MySQL...');
    
    // Testing connection
    await new Promise((resolve, reject) => {
      connection.connect(err => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Connected to MySQL server');

    //Database 
    await new Promise((resolve, reject) => {
      connection.query('CREATE DATABASE IF NOT EXISTS students', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Database created or already exists');

    await new Promise((resolve, reject) => {
      connection.query('USE students', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS students (
       name VARCHAR(100) NOT NULL,
        email varchar(100) NOT NULL,
        course varchar(100) NOT NULL
      )
    `;

    await new Promise((resolve, reject) => {
      connection.query(createTableSQL, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('students table created or already exists');

    // sample data
    const insertSampleData = `
      INSERT IGNORE INTO students (name, email, course) VALUES
      ('Thabo', 'thabo@gmail.com', 'Maths'),
      ('Mpho', 'mpho@gmail.com', 'Algebra')
    `;

    await new Promise((resolve, reject) => {
      connection.query(insertSampleData, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Sample data inserted');

    console.log('MySQL setup completed successfully!');

  } catch (error) {
    console.error('MySQL setup failed:', error.message);
  } finally {
    connection.end();
    console.log('Connection closed');
  }
}

setupMySQL();
