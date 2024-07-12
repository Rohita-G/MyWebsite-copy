const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'firstdata'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Route to handle form submission and commit to the database
router.post('/', (req, res) => {
    // Retrieve form data from session
    const formData = req.session.formData;
    const formData1 = req.session.formData1;
    const formData2 = req.session.formData2;

    if (!formData || !formData1 || !formData2) {
        res.send('Incomplete form data. Please fill all sections.');
        return;
    }

    // Insert the user details into the database
    const userDetailsQuery = 'INSERT INTO user_details (lastName, firstName, middleInitial, otherLastNames, dob, ssn, apiKey) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const userDetailsValues = [...Object.values(formData), req.session.apiKey];

    connection.query(userDetailsQuery, userDetailsValues, (err, results) => {
        if (err) {
            console.error('Error submitting user details:', err.message);
            res.send('An error occurred while submitting user details.');
            return;
        }

        // Insert the user address into the database
        const userAddressQuery = 'INSERT INTO user_address (address, aptNumber, city, state, zipCode, apiKey) VALUES (?, ?, ?, ?, ?, ?)';
        const userAddressValues = [...Object.values(formData1), req.session.apiKey];

        connection.query(userAddressQuery, userAddressValues, (err, results) => {
            if (err) {
                console.error('Error submitting user address:', err.message);
                res.send('An error occurred while submitting user address.');
                return;
            }

            // Insert the user contacts into the database
            const userContactsQuery = 'INSERT INTO user_contacts (email, phone, apiKey) VALUES (?, ?, ?)';
            const userContactsValues = [...Object.values(formData2), req.session.apiKey];

            connection.query(userContactsQuery, userContactsValues, (err, results) => {
                if (err) {
                    console.error('Error submitting user contacts:', err.message);
                    res.send('An error occurred while submitting user contacts.');
                } else {
                    console.log('Form submitted successfully:', results);
                    res.send('Form submitted successfully!');
                }
            });
        });
    });
});

module.exports = router;