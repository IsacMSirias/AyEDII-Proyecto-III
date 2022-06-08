'use strict'

const express = require('express')
const path = require('path')

//webpack

const webpack = require('webpack')
const webpackDev = require('webpack-dev-middleware')
const config = require('./webpack.config')

const app = express()

//middlewares

app.use(webpackDev(webpack(config)))

//static files

app.use(express.static(path.join(__dirname, 'public')))

//starting server

app.listen(3000, () => {
    console.log('serever listening on port ${3000}')
})