import { connection } from "./server";

export const handleReviewClicked = (restaurantName) => {
    const customerId = localStorage.getItem('customerId'); // Retrieve customerId from localStorage
    console.log(restaurantName, customerId);

    // query = "INSERT INTO Review (rating,reviewNotes,dayPosted,customerId,restaurantId) VALUES (%s,%s,%s,%s,%s)"
    const query = 'INSERT INTO Review (rating, reviewNotes, dayPosted, customerId, restaurantId) VALUES (?, ?, ?, ?, ?)';
    const values = [rating, reviewNotes, dayPosted, customerId, resturantId];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send({ success: false, message: 'Database error' });
        }
        else {
            res.send({ success: true, data: result });
        }
    });
}

// module.exports(handleReviewClicked)