// requires
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const colors = require('colors');

// instances
const app = express();

// express config
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// endpoints


// listener
app.listen(3001, () => {
    console.log('API SERVER LISTENING ON PORT 3001')
})

//exports
console.log(module.exports)



