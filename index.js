const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory where your views are located
app.set('views', './views');


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'firstdata'
});

connection.connect((err) => {
    if (err) {
        console.error('Connection error:', err.code);
        console.error('Fatal:', err.fatal);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const loginRouter = require(path.join(__dirname, 'login.js'));
const fillformRouter = require(path.join(__dirname, 'fillform.js'));
const commitRoutes = require(path.join(__dirname,'commit.js'));
const baseRoutes = require('./base');
const welcomeRouter = require('./welcome');
const customerRouter = require('./customers');
const landingPageRouter=require('./landingPage');

app.use(loginRouter);
app.use('/fillform', fillformRouter);
app.use('/commit', commitRoutes);
app.use('/base', baseRoutes);
app.use('/welcome', welcomeRouter);
app.use('/customers', customerRouter);
app.use('/landingPage', landingPageRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', (req, res) => {
    const { fullname, emailid, password } = req.body;

    console.log('Received form data:', req.body);

    if (!fullname || !emailid || !password) {
        res.status(400).send('All fields are required.');
        return;
    }

    const checkUserQuery = 'SELECT user_id FROM users WHERE emailid = ? AND fullname = ?';

    connection.query(checkUserQuery, [emailid, fullname], (err, results) => {
        if (err) {
            console.error('An error occurred during user check:', err);
            res.status(500).send('An error occurred during registration. Please try again later.');
            return;
        }

        if (results.length > 0) {
            res.send('User already registered. Please <a href="/login.html">login</a>.');
        } else {
            const userId = generateUserId();
            const registerQuery = 'INSERT INTO users (user_id, fullname, emailid, password) VALUES (?, ?, ?, ?)';

            connection.query(registerQuery, [userId, fullname, emailid, password], (err, results) => {
                if (err) {
                    console.error('An error occurred during registration:', err);
                    res.status(500).send('An error occurred during registration. Please try again later.');
                    return;
                }

                res.send('Registration successful! You can now <a href="/login.html">login</a>.');
            });
        }
    });
});

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error ending the connection:', err.message);
            return;
        }
        console.log('Connection closed.');
        process.exit();
    });
});