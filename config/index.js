const dotenv = require('dotenv');

dotenv.config( { path : 'config.env'} )
const APP_PORT = process.env.APP_PORT || 8080
const DEBUG_MODE = process.env.DEBUG_MODE 


dotenv.config();

module.exports={
    APP_PORT,
    DEBUG_MODE

}