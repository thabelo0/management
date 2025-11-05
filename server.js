import express from 'express';
import cors from 'cors';
import studentsRouter from './routes/students.js';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting Students Service Server...');

// Creating pool
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

console.log(' Environment check:', {
  PORT: process.env.PORT,
  MYSQLHOST: process.env.MYSQLHOST ? 'Set' : 'Missing',
  MYSQLDATABASE: process.env.MYSQLDATABASE
});

const app = express();
app.use(cors());
app.use(express.json());

// Database initialization
const createDatabaseAndTables = () => {
  return new Promise((resolve, reject) => {

    
    // temporary connection
    const tempPool = mysql.createPool({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      port: process.env.MYSQLPORT || 3306
    });

    // Ddatabase
    tempPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQLDATABASE}`, (err) => {
      if (err) {
        console.error('Error creating database:', err.message);
        tempPool.end();
        reject(err);
      } else {
        console.log(' Database created/verified:', process.env.MYSQLDATABASE);
        
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            course VARCHAR(100) NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;

        tempPool.query(createTableSQL, (tableErr) => {
          if (tableErr) {
            console.error(' Error creating students table:', tableErr.message);
            tempPool.end();
            reject(tableErr);
          } else {
            console.log(' Students table created');
            
            // sample data
            const sampleDataSQL = `
              INSERT IGNORE INTO ${process.env.MYSQLDATABASE}.students (name, email, course) VALUES
              ('Thabo', 'thabo@gmail.com', 'Algebra'),
              ('Mpho', 'mpho@gmail.com', 'IT')
            `;
            
            tempPool.query(sampleDataSQL, (insertErr) => {
              tempPool.end();
              if (insertErr) {
                console.log('Sample data already exists or insertion skipped');
              } else {
                console.log('Sample data inserted');
              }
              resolve();
            });
          }
        });
      }
    });
  });
};

const initializeDatabase = async () => {
  try {
    // connection testing to database
    await new Promise((resolve, reject) => {
      pool.getConnection((connErr, connection) => {
        if (connErr) {
          console.error(' Database connection error:', connErr.message);
          
          if (connErr.code === 'ER_BAD_DB_ERROR') {
            console.log('Database does not exist, creating it...');
            reject(connErr);
          } else {
            reject(connErr);
          }
        } else {
          console.log('Database connection successful');
          connection.release();
          resolve();
        }
      });
    });
    
    console.log('Database is ready');
  } catch (error) {
    if (error.code === 'ER_BAD_DB_ERROR') {
      
      // creating databaseata if it doesn't exist
      await createDatabaseAndTables();
      console.log('Database and tables created successfully');
    } else {
      console.error('Database initialization failed:', error.message);
      throw error;
    }
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Students Service is running!',
    endpoints: {
      health: '/health',
      students: '/api/students'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: err.message 
      });
    }
    
    connection.query('SELECT 1 as test', (queryErr, results) => {
      connection.release();
      
      if (queryErr) {
        return res.status(500).json({ 
          status: 'error', 
          message: 'Database query failed',
          error: queryErr.message 
        });
      }
      
      res.json({ 
        status: 'healthy', 
        message: 'Students service and database are working',
        timestamp: new Date().toISOString()
      });
    });
  });
});

//  checking database and tables
app.get('/debug/db', (req, res) => {
  pool.query('SELECT DATABASE() as current_db, USER() as user', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    pool.query('SHOW TABLES', (tableErr, tables) => {
      if (tableErr) {
        return res.status(500).json({ error: tableErr.message });
      }
      
      res.json({
        current_database: results[0].current_db,
        current_user: results[0].user,
        tables: tables,
        environment: {
          MYSQLDATABASE: process.env.MYSQLDATABASE,
          MYSQLHOST: process.env.MYSQLHOST
        }
      });
    });
  });
});

// API routes
app.use('/api/students', studentsRouter);

const PORT = process.env.PORT || 4001;

// database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Students Server running on port ${PORT}`);
      console.log(`Using database: ${process.env.MYSQLDATABASE}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error.message);
    console.log('Starting server anyway...');
    
    app.listen(PORT, () => {
      console.log(`Students Server running on port ${PORT} (database may have issues)`);
    });
  });

export { pool };
