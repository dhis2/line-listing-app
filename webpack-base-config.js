var path = require('path');
var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');

var btoa = function(s) { return new Buffer(s).toString('base64'); }
var dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;
var dhisConfig;

try {
    console.log(dhisConfigPath)
    dhisConfig = require(dhisConfigPath);
    console.log(dhisConfig);
} catch (e) {
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message);
    console.info('Using default config');
    dhisConfig = {
        baseUrl: 'http://localhost:8080',
        authorization: btoa("admin:district")
    };
}

var isDevBuild = process.argv[1].indexOf('webpack-dev-server') !== -1;
var scriptPrefix = isDevBuild ? dhisConfig.baseUrl : '..';
var ckeditorBasePath = `${scriptPrefix}/dhis-web-core-resource/ckeditor/4.6.1`;

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
        // Plugins to extend webpack functionality (https://webpack.github.io/docs/plugins.html)
        /* Example that provides `fetch` as a global variable
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
        */
        //new webpack.ProvidePlugin({
            //$: "jquery",
            //jQuery: "jquery",
            //"window.jQuery": "jquery"
        //}),
        new HTMLWebpackPlugin({
            template: './index.ejs',
            inject: false,
            vendorScripts: [
                `<script type="text/javascript">window.CKEDITOR_BASEPATH = '${ckeditorBasePath}/';</script>`,
                `<script src="${ckeditorBasePath}/ckeditor.js"></script>`,
            ].join("\n"),
        }),
    ],
};
