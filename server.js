const initializeDatabase = () => {
  // First test if we can connect to the database
  pool.getConnection((connErr, connection) => {
    if (connErr) {
      console.error('❌ Database connection error:', connErr.message);
      
      if (connErr.code === 'ER_BAD_DB_ERROR') {
        console.log('🔄 Database does not exist, creating it...');
        createDatabaseAndTables();
        return;
      }
    } else {
      console.log('✅ Database connection successful');
      connection.release();
      createTables();
    }
  });
};

const createDatabaseAndTables = () => {
  // Create a temporary connection without database name
  const tempPool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT || 3306
  });

  // Create database
  tempPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQLDATABASE}`, (err) => {
    if (err) {
      console.error('❌ Error creating database:', err.message);
    } else {
      console.log('✅ Database created:', process.env.MYSQLDATABASE);
      
      // Now create tables
      createTables();
    }
    tempPool.end();
  });
};

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

// Initialize database when server starts
initializeDatabase();
