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

router.post('/base', (req, res) => {

    console.log(err);

    res.redirect('/base.html');
     


    });


module.exports = router;