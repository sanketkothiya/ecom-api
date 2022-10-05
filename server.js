const express = require('express')
// const { APP_PORT } = require('./config')
const router = require('./routes')
const morgan = require('morgan');
const bodyparser = require("body-parser");
const errorHandler = require('./middlewares/errorHandler')
const path = require('path')
// const cors = require('cors')

const connectDB = require('./database/connection');
connectDB();
const app = express()



// app.use(cors());

const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' })
const APP_PORT = process.env.APP_PORT
// log requests
app.use(morgan('tiny'));


// globally define app root and use any where
global.appRoot = path.resolve(__dirname);
console.log(appRoot);

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json())


// upload photos
// app.use('/uploads', express.static('uploads'));

app.use('/api', router);
app.use(errorHandler)


app.listen(APP_PORT, () => {
       console.log(`listening on port ${APP_PORT}`);
})

