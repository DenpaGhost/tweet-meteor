require('dotenv').config()

export default {
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy'
    ],
    buildModules: [
        '@nuxtjs/dotenv'
    ],
    env: {...process.env},
}