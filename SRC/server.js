const express = require('express'); // Import Express
const app = express();             // Create an Express app
const cors = require('cors');
const PORT = 3000;                 // Define the port number
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

app.use(express.json());
app.use(cors());
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

    const query = 'SELECT userPassword FROM Customer WHERE email= ?';
    const values = [email];
    console.log("hi")
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            res.status(500).send({ success: false, message: 'Database error' });
        } else {
            if(result[0].userPassword==password){
                res.send({ success: true, message: 'User successfully verified' });
            }
            else{
                res.send({ success: false, message: 'Incorrect Password' });
            }
            
        }
    });
    console.log("bye")
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


