const config = {
    type: 'app',
    name: 'line-listing',
    id: 'a4cd3827-e717-4e09-965d-ab05df2591e5',
    title: 'Line Listing',

    minDHIS2Version: '2.39',

    pwa: {
        enabled: true,
        caching: {
            patternsToOmitFromAppShell: [/.*/],
        },
    },

    entryPoints: {
        app: './src/AppWrapper.jsx',
        plugin: './src/PluginWrapper.jsx',
    },
}

module.exports = config
