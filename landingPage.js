const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'firstdata'
});
app.use(express.static(path.join(__dirname, 'public')));

router.post('/landingPage', (req, res) => {

    console.log(err);

    res.redirect('/landingPage.html');
     


    });


module.exports = router;