require.config({
    baseUrl: 'http://adam1985.github.io/bxyk/assets/src',
    paths: {
        'jquery': 'jquery/jquery',
        'mediaelement' : 'http://adam1985.github.io/bxyk/js/mediaelement/build/mediaelement.min'
    },
    shim: {
        'mediaelement': ['jquery']
    },
});

require(['controller/initialize']);