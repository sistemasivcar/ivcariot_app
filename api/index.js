// requires
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const colors = require('colors');

// instances
const app = express();

// express config
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// middlewares

// endpoints
require('./startup/routes.js')(app);

// config db
require('./startup/db.js')()
// start the server for requests
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nListening on port ${port}...`.bgGreen));








