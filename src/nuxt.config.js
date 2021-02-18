require('dotenv').config()

export default {
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy'
    ],
    buildModules: [
        '@nuxtjs/dotenv'
    ],
    env: {
        ...process.env
    },
    proxy: {
        '/twitter-api-v2': {
            target: 'https://api.twitter.com/2/',
            pathRewrite: {'^/twitter-api-v2': ''},
            headers: {'Authorization': `Bearer ${process.env.BEARER_TOKEN}`}
        }
    }
}