var express = require('express');
var app = express();
var router = express.Router();

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'firstdata'
});

connection.connect(function (err) {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});
router.get("/", function (request, response, next) {
    const loggedInUserId = request.session.userDetailsId;
    const addressId = request.session.addressId;
    const contactId = request.session.contactId;
    console.log(loggedInUserId, addressId, contactId);
    // Create a list to store all promises
    let queries = [];

    // User Details Query
    queries.push(new Promise((resolve, reject) => {
        let query = "SELECT * FROM user_details WHERE userDetailsId = ? ORDER BY userDetailsId DESC";
        connection.query(query, [loggedInUserId], function (error, data) {
            if (error) return reject(error);
            resolve({ sampleData: data });
        });
    }));

    // Address Data Query
    queries.push(new Promise((resolve, reject) => {
        let query = "SELECT * FROM user_address WHERE addressId = ? ORDER BY addressId DESC";
        connection.query(query, [loggedInUserId], function (error, data) {
            if (error) return reject(error);
            resolve({ addressData: data });
        });
    }));

    // async function getUserContacts(contactId) {
    //     try {
    //         let query = "SELECT * FROM user_contacts WHERE contactId = ? ORDER BY contactId DESC";
    //         console.log(contactId);
    //         // Create a promise that wraps the connection.query method
    //         const result = await new Promise((resolve, reject) => {
    //             connection.query(query, [contactId], function(error, data) {
    //                 if (error) {
    //                     reject(error);
    //                 } else {
    //                     resolve({ contactsData: data });
    //                 }
    //             });
    //         });

    //         console.log(result);
    //         return result;
    //     } catch (error) {
    //         console.error('Error querying user contacts:', error);
    //     }
    // }

    // Contacts Data Query
    queries.push(new Promise((resolve, reject) => {
        let query = "SELECT * FROM user_contacts WHERE contactId = ? ORDER BY contactId DESC";
        connection.query(query, [loggedInUserId], function (error, data) {
            if (error) return reject(error);
            resolve({ contactsData: data });
        });
    }));

    // getUserContacts(loggedInUserId);

    // Run all queries and combine the results
    Promise.all(queries)
        .then(results => {
            console.log(results);
            console.log(results[2].contactsData);
            let combinedResults = results.reduce((acc, result) => ({ ...acc, ...result }), {});
            response.render('welcome', {
                title: 'User Dashboard',
                action: 'list',
                ...combinedResults
            });
        })
        .catch(error => next(error));
});

router.post("/add_welcome", function (request, response, next) {
    // Your existing logic for adding data
    let { lastName, firstName, middleInitial, otherLastNames, dob, ssn } = request.body;
    let query = `INSERT INTO user_details (lastName, firstName, middleInitial, otherLastNames, dob, ssn) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(query, [lastName, firstName, middleInitial, otherLastNames, dob, ssn], function (error, data) {
        if (error) throw error;
        response.redirect("/welcome");
    });
});

router.post("/add_welcome", function (request, response, next) {
    // Your existing logic for adding addresses
    let { address, aptNumber, city, state, zipCode } = request.body;
    let query = `INSERT INTO user_address (address, aptNumber, city, state, zipCode) VALUES (?, ?, ?, ?, ?)`;
    connection.query(query, [address, aptNumber, city, state, zipCode], function (error, data) {
        if (error) throw error;
        response.redirect("/welcome");
    });
});

router.post("/add_welcome", function (request, response, next) {
    // Your existing logic for adding contacts
    let { email, phone } = request.body;
    let query = `INSERT INTO user_contacts (email, phone) VALUES (?, ?)`;
    connection.query(query, [email, phone], function (error, data) {
        if (error) throw error;
        response.redirect("/welcome");
    });
});

router.get('/edit/details/:userDetailsId', function (request, response, next) {

    var userDetailsId = request.params.userDetailsId;

    var query = `SELECT * FROM user_details WHERE userDetailsId = "${userDetailsId}"`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            response.render('welcome', { title: 'Edit MySQL Table Data', action: 'edit', type: 'details', sampleData: data[0] });
        }
    });

});

router.get("/edit/address/:addressId", function (request, response, next) {
    var addressId = request.params.addressId;
    console.log(request.params);
    console.log(addressId);
    var query = `SELECT * FROM user_address WHERE addressId = "${addressId}"`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            console.log(data)
            response.render("welcome", {
                title: "Edit MySQL Table Data",
                action: "edit",
                type: 'address',
                addressData: data[0],
            });
        }
    });
});

router.get('/edit/contact/:contactId', function (request, response, next) {

    var contactId = request.params.contactId;

    var query = `SELECT * FROM user_contacts WHERE contactId = "${contactId}"`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            console.log('contacts data: ', data);
            response.render('welcome', { title: 'Edit MySQL Table Data', action: 'edit', type: 'contact', contactsData: data[0] });
        }
    });

});


router.post('/edit/details/:userDetailsId', function (request, response, next) {

    var userDetailsId = request.params.userDetailsId;

    var lastName = request.body.lastName;

    var firstName = request.body.firstName;

    var middleInitial = request.body.middleInitial;

    var otherLastNames = request.body.otherLastNames;

    var dob = request.body.dob;

    var ssn = request.body.ssn;

    var query = `
	UPDATE user_details 
	SET lastName = "${lastName}", 
	firstName = "${firstName}", 
	middleInitial = "${middleInitial}", 
	otherLastNames = "${otherLastNames}",
	dob = "${dob}", 
    ssn = "${ssn}"
	WHERE userDetailsId = "${userDetailsId}"
	`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            response.redirect('/welcome');
        }

    });

});

router.post('/edit/address/:addressId', function (request, response, next) {

    var addressId = request.params.addressId;

    var address = request.body.address;

    var aptNumber = request.body.aptNumber;

    var city = request.body.city;

    var state = request.body.state;

    var zipCode = request.body.zipCode;


    var query = `
	UPDATE user_address 
	SET address = "${address}", 
	aptNumber = "${aptNumber}", 
	city = "${city}", 
	state = "${state}",
	zipCode = "${zipCode}"
	WHERE addressId = "${addressId}"
	`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            response.redirect('/welcome');
        }

    });

});

router.post('/edit/contact/:contactId', function (request, response, next) {

    var contactId = request.params.contactId;

    var email = request.body.email;

    var phone = request.body.phone;



    var query = `
	UPDATE user_contacts 
	SET email = "${email}", 
	phone = "${phone}"
	WHERE contactId = "${contactId}"
	`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            response.redirect('/welcome');
        }

    });

});

router.get('/delete/details/:userDetailsId', function (request, response, next) {

    var userDetailsId = request.params.userDetailsId;

    var query = `
	DELETE FROM user_details WHERE userDetailsId = "${userDetailsId}"
	`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            response.redirect("/welcome");
        }

    });

});

router.get('/delete/address/:addressId', function (request, response, next) {

    var addressId = request.params.addressId;

    var query = `
	DELETE FROM user_address WHERE addressId = "${addressId}"
	`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            response.redirect("/welcome");
        }

    });

});

router.get('/delete/contact/:contactId', function (request, response, next) {

    var contactId = request.params.contactId;

    var query = `
	DELETE FROM user_contacts WHERE contactId = "${contactId}"
	`;

    connection.query(query, function (error, data) {
        if (error) {
            throw error;
        } else {
            response.redirect("/welcome");
        }

    });

});









module.exports = router;