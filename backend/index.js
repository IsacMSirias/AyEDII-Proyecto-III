import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import UsersDAO from "./dao/usersDAO.js"
import DocumentsDAO from "./dao/documentsDAO.js"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

dotenv.config()
const MongoClient = mongodb.MongoClient

const { compress_LZ77 } = require('./build/Release/compresslz77.node');
const { decompress_LZ77 } = require('./build/Release/decompresslz77.node');
const { compress_LZ78 } = require('./build/Release/compresslz78.node');
const { decompress_LZ78 } = require('./build/Release/decompresslz78.node');

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.USERSREVIEWS_DB_URI,
    {
        maxPoolSize: 50,
        useNewUrlParser: true }
    )
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await UsersDAO.injectDB(client)
        await DocumentsDAO.injectDB(client)
        console.log(compress_LZ77('ola12312312312'))
        app.listen(port, () => {
            console.log(compress_LZ78('ola12312312312'))
            console.log('listening on port ' + port)
        })
    })