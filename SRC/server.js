// const express = require('express'); // Import Express
import express from 'express'
const app = express();             // Create an Express app
// const cors = require('cors');
import cors from 'cors';
const PORT = 3000;                 // Define the port number
// const path = require('path');
import path from 'path'
import { fileURLToPath } from 'url';
// const mysql = require('mysql2');
import mysql from 'mysql2'
// require('dotenv').config();
import dotenv from 'dotenv'
dotenv.config();

// __dirname workaround for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next()
});

app.use(express.static(path.join(__dirname, '../SRC')));

const connection = mysql.createConnection({
    host: 'localhost',        // Hostname of your database
    user: 'root',             // Your MySQL username
    password: process.env.DB_PASSWORD,  // Your MySQL password
    database: process.env.DB_NAME   // Name of the database you want to connect to
});

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../SRC/index.html'));
});

app.get('/about', (req, res) => {
    res.send('This is the About Page.');
});

app.post('/signup', (req, res) => {
    console.log("reached")
    const { firstName, lastName, email, password } = req.body;

    const query = 'INSERT INTO Customer (fName, lName, email, userPassword) VALUES (?, ?, ?, ?)';
    const values = [firstName, lastName, email, password];
    console.log("hi")
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            res.status(500).send({ success: false, message: 'Database error' });
        } else {
            res.send({ success: true, message: 'User added successfully' });
        }
    });
    console.log("bye")
});

app.post('/login', (req, res) => {
    console.log("reached")
    const { email, password } = req.body;
    console.log(password)
    const query = 'SELECT userId, userPassword FROM Customer WHERE email= ?';
    const values = [email];
    console.log("hi")
    connection.query(query, values, (err, result) => {
        console.log(`Input Password: ${password}`);
        console.log(`Stored Password: ${result[0].userPassword}`);
        console.log(`Are they equal?`, result[0].userPassword === password);
        if (err) {
            console.error('Error inserting into database:', err);
            res.status(500).send({ success: false, message: 'Database error' });
        } else {
            if (result[0].userPassword === password) {
                console.log("user verified")
                res.send({ success: true, message: 'User successfully verified', customerId: result[0].userId });
            }
            else {
                console.log("User not verified")
                res.send({ success: false, message: 'Incorrect Password' });
            }

        }
    });
    console.log("bye")
});

// finding restaurants
app.get('/search-restaurants', (req, res) => {
    console.log('searching')
    const searchTerm = `%${req.query.name}%`;
    const limit = parseInt(req.query.limit, 10);

    // query to grab all restaurant data + reviews + genre
    const query = `SELECT r.*, g.genre, AVG(v.rating) AS average_review
                   FROM Restaurant r, RestaurantGenre g, Review v
                   WHERE r.restaurantName LIKE ? AND 
                         r.restaurantID = g.restaurantID AND
                         r.restaurantID = v.restaurantID
                   GROUP BY r.restaurantID, g.genre
                   LIMIT ?`;
    const values = [searchTerm, limit];
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send({ success: false, message: 'Database error' });
        }
        else {
            res.send({ success: true, data: result });
        }
    });

})

// Define route to fetch personalized order history
app.get('/order-history', (req, res) => {
    const { customerId } = req.query;

    if (!customerId) {
        return res.status(400).send({ success: false, message: 'Customer ID is required' });
    }

    const query = `
        SELECT 
            po.orderDate,
            r.restaurantName,
            SUM(mi.itemPrice) AS totalCost
        FROM 
            PlacedOrder po
        JOIN 
            OrderItem oi ON po.orderId = oi.orderId
        JOIN 
            MenuItem mi ON oi.itemName = mi.itemName AND oi.restaurantId = mi.restaurantId
        JOIN 
            Restaurant r ON po.restaurantId = r.restaurantId
        WHERE 
            po.customerId = ?
        GROUP BY 
            po.orderId, po.orderDate, r.restaurantName
        ORDER BY 
            po.orderDate DESC;
    `;

    connection.query(query, [customerId], (err, results) => {
        if (err) {
            console.error('Error fetching order history:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }

        console.log('Order History Results:', results); // Log the results
        res.send({ success: true, data: results });
    });
});


// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    //   console.log('DB Password:', process.env.DB_PASSWORD);
    //     console.log('DB Name:', process.env.DB_NAME);

});


