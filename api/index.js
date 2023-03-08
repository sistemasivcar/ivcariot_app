// requires
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('colors');

// instances
const app = express();

// middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// endpoints
require('./startup/routes.js')(app);

// config db
require('./startup/db.js')()

// start the server for requests
const port = process.env.API_PORT || 3001;
app.listen(port, () => console.log(`\nListening on port ${port}...`.bgGreen));

if(process.env.environment != "development"){
    const app2 = express();
    app.listen(3002,function (){
        console.log("Listening on port 3002 (to redirect to ssl)")
    })

    app2.all('*',function(req, res){
        console.log("NO SSL ACCESS... redirecting");
        return res.redirect(`https://${req.headers['host']}${req.url}`);

    })
}






