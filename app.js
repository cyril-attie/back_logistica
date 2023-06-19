const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();

var whitelist = ['http://localhost:4200','http://localhost:3000','http://almazenunir.es','http://www.almazenunir.es']
var corsOptions = {
    origin: function (origin, callback) {
        console.log(origin)
        if (whitelist.indexOf(origin) !== -1 ||!origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions)) // Use this after the variable declaration


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'front_logistica/dist/front_logistica')));

app.use('/api', apiRouter);





// Al front todo el resto 
app.get('*', function (req, res) {
    res.sendFile(path.resolve('front_logistica/dist/front_logistica/index.html'));
});

module.exports = app;
