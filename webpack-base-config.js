var path = require('path');
var webpack = require('webpack');

const HTMLWebpackPlugin = require('html-webpack-plugin');

const isDevBuild = process.argv[1].indexOf('webpack-dev-server') !== -1;
const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;

var dhisConfig;

try {
    dhisConfig = require(dhisConfigPath);
    //    console.log('\nLoaded DHIS config:');
} catch (e) {
    // Failed to load config file - use default config
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message);
    console.info('Using default config');
    dhisConfig = {
        baseUrl: 'http://localhost:8080',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };
}

const scriptPrefix = (isDevBuild ? dhisConfig.baseUrl : '..');

module.exports = {
    context: __dirname,
    entry: {
        'app': './src/index.js',
        'eventreport': './src/plugin.js',
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src/'),
                ],
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-2'],
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url-loader?limit=8192'
                ]
            },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            chunks: ['app'],
            template: './index.ejs',
            vendorScripts: [
                `${scriptPrefix}/dhis-web-core-resource/babel-polyfill/6.20.0/dist/polyfill${isDevBuild ? '' : '.min'}.js`,
            ]
            .map(script => {
                return (`<script src="${script}"></script>`);
            }).join("\n"),
        })
    ]
};
