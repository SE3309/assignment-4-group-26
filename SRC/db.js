import dotenv from 'dotenv'
dotenv.config();

import mysql from 'mysql2'

export const connection = mysql.createConnection({
    host: 'localhost',        // Hostname of your database
    user: 'root',             // Your MySQL username
    password: process.env.DB_PASSWORD,  // Your MySQL password
    database: process.env.DB_NAME   // Name of the database you want to connect to
});