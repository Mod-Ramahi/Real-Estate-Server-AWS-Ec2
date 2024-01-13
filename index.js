const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes')
const compression = require('compression')
const morgan = require('morgan')
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

const originAllowed = '*';

app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', originAllowed)
    res.header('Access-Control-Allow-Methods', 'HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization')
    res.header(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    // res.header('Content-Security-Policy', 'upgrade-insecure-requests')
    next()
});
app.use([
    compression(),
    express.json(),
    express.urlencoded({ extended: false })
])

app.use(morgan('dev'));
if (process.env.NODE_ENV === 'development') {

};

app.use('/api/v1', router)

const mongooseUrl = process.env.Mongoose_Url;
mongoose.connect(mongooseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true
})
    .then(() => console.log('connected to mongoDB'))
    .catch((error) => console.error('error connecting to mongoDB:', error));

app.use((req, res, next) => {
    res.status(404).json('bad request')
});
app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status).json(error.message)
    } else {
        console.log(error)
        res.status(500).json('interval server error')
    }
});
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

