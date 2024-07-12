const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'firstdata'
});


router.post('/login', (req, res) => {
    const emailid = req.body.emailid;
    const password = req.body.password;
    // Log the received form data for debugging
    console.log('Received form data:', req.body);


    // Log the received form data for debugging

    // Validate the form data


    if (!emailid || !password) {
        res.status(400).send('All fields are required.');
        return;
    }

    const query = 'SELECT u.*, ud.userDetailsId FROM users u LEFT JOIN user_details ud ON u.id = ud.userDetailsId WHERE u.emailid = ? AND u.password = ?';
    connection.query(query, [emailid, password], (err, results) => {
        if (err) {
            console.error('An error occurred with the query:', err.message);
            res.send('An error occurred.');
            return;
        }

        console.log('Query results:', results); // Log the results to see what's being returned

        if (results.length > 0) {
            console.log('User found:', results[0]);
            const userDetailsId = results[0].userDetailsId;
            const addressId = results[0].addressId;
            const contactId = results[0].connectionId;;
            if (userDetailsId) {
                // User details found in the user_details table
                req.session.userDetailsId = userDetailsId;
                console.log('User details found. Redirecting to /welcome');
                req.session.addressId = addressId;
                console.log('User address found. Redirecting to /welcome');
                req.session.contactId = contactId;
                console.log('User contacts found. Redirecting to /welcome');
                res.redirect('/welcome');
            } else {
                // User found in users table but details not found in user_details table
                req.session.userDetailsId = null;
                console.log('User details not found in user_details table. Redirecting to /fillform.html');
                res.redirect('/fillform.html');
            }
        } else {
            // No user found
            console.log('No user found, redirecting to /fillform.html');
            res.redirect('/fillform.html');
        }
        

    });
    });
// Example route to serve the new login page



module.exports = router;
