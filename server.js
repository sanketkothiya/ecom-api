const express = require('express')
// const { APP_PORT } = require('./config')
const router = require('./routes')
const morgan = require('morgan');
const bodyparser = require("body-parser");
const errorHandler = require('./middlewares/errorHandler')
const connectDB = require('./database/connection');
const app = express()

const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' })
const APP_PORT = process.env.APP_PORT
// log requests
app.use(morgan('tiny'));

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))

connectDB();
app.use(express.json())
app.use('/api', router);
app.use(errorHandler)

app.listen(APP_PORT, () => {
       console.log(`listening on port ${APP_PORT}`);
})
