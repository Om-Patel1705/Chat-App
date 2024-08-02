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
require("dotenv").config();
config();

const pool = new Pool({
  // user: "postgres",
  // password: "12345",
  // database: "chat-app-db",
  // host: "localhost",
  // port: 5432

  connectionString: process.env.DATABASE_URL,
  ssl: true, 
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err.message);
    process.exit(1); // Exit the application on connection error
  });

const createTablesQuery = `
CREATE TABLE USERS(
  	id SERIAL PRIMARY KEY,
  	username TEXT,
  	email TEXT,
  	password TEXT,
  	pic TEXT
);


create table chat(
     chatid SERIAL PRIMARY KEY,
     chatname TEXT,
     isgroup BOOLEAN,
     groupadmin INTEGER,
     latestmessage INTEGER,
     FOREIGN KEY(groupadmin) REFERENCES users(id)
);


CREATE table chat_users_junction(
   id INTEGER,
   chatid INTEGER,
   PRIMARY KEY(id,chatid),
   FOREIGN KEY(id) REFERENCES users(id),
   FOREIGN KEY(chatid) REFERENCES chat(chatid)
);


CREATE TABLE messages(
  id SERIAL PRIMARY KEY,
  senderid INTEGER,
  content TEXT,
  time TIMESTAMP,
  chatid INTEGER,
  FOREIGN KEY(chatid) REFERENCES chat(chatid),
  FOREIGN KEY(senderid) REFERENCES users(id)
);
`;

pool
  .query(createTablesQuery)
  .then(() => {
    console.log("Tables successfully created or already exist.");
  })
  .catch((err) => {
    console.error("Error creating tables:", err.message);
  });

module.exports = pool;
