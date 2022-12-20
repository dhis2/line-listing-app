const config = {
    type: 'app',
    name: 'line-listing',
    id: 'a4cd3827-e717-4e09-965d-ab05df2591e5',
    title: 'Line Listing',

    minDHIS2Version: '2.38',

    entryPoints: {
        app: './src/AppWrapper.js',
        plugin: './src/PluginWrapper.js',
    },
}

module.exports = config
