import express from 'express';
import cors from 'cors';
import studentsRouter from './routes/students.js';
import pool from './db.js';

const app = express();

console.log('🚀 Starting Students Service Server...');
console.log('📋 Environment check:', {
  PORT: process.env.PORT,
  MYSQLHOST: process.env.MYSQLHOST ? 'Set' : 'Missing',
  MYSQLDATABASE: process.env.MYSQLDATABASE
});

app.use(cors());
app.use(express.json());

// Create tables if they don't exist (non-blocking)
const createTables = () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      course VARCHAR(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  pool.query(createTableSQL, (err) => {
    if (err) {
      console.error('❌ Error creating students table:', err.message);
    } else {
      console.log('✅ Students table ready');
      
      // Insert sample data
      const sampleDataSQL = `
        INSERT IGNORE INTO students (name, email, course) VALUES
        ('Thabo', 'thabo@gmail.com', 'Algebra'),
        ('Mpho', 'mpho@gmail.com', 'IT')
      `;
      
      pool.query(sampleDataSQL, (insertErr) => {
        if (insertErr) {
          console.log('ℹ️ Sample data already exists');
        } else {
          console.log('✅ Sample data inserted');
        }
      });
    }
  });
};

// Initialize database
createTables();

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

// API routes - FIXED ROUTE to match frontend
app.use('/api/students', studentsRouter);

const PORT = process.env.PORT || 4001; // CHANGED PORT to avoid conflict

app.listen(PORT, () => {
  console.log(`🚀 Students Server running on port ${PORT}`);
  console.log(`📊 Using database: ${process.env.MYSQLDATABASE}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
