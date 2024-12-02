import { Router } from "express";
import { connection } from "../db.js";

const router = Router();

router.route('/')
    .post((req, res) => {
        const { rating, reviewNotes, customerId, resturantId } = req.body;
        const dayPosted = new Date();
        console.log(rating, reviewNotes, dayPosted, customerId, resturantId);
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
    })

export default router;