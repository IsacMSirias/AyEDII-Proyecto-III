module.exports = {
    mode: 'development',
    entry: __dirname + '/src',
    output: {
        path: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }

}