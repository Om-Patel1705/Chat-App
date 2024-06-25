// const mongoose = require("mongoose");


// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {});
//     console.log(`MongoDB Connected: ${conn.connection.host} `);
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     process.exit();
//   }
// };

// module.exports = connectDB;

const { config } = require("dotenv");
const { Pool } = require("pg");
require('dotenv').config();
config();

const pool = new Pool({
  // user: "postgres",
  // password: "12345",
  // database: "chat-app-db",
  // host: "localhost",
  // port: 5432

 connectionString: process.env.DATABASE_URL,
    ssl: true
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err.message);
    process.exit(1); // Exit the application on connection error
  });



module.exports = pool;
