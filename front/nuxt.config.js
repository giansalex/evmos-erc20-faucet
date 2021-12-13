/* eslint-disable no-console */
require('dotenv').config()
const modifyHtml = (html) => {
  return html.replace(/data-n-head=""|data-n-head="true"/g, '')
}

const modules = [
  ['nuxt-buefy', { css: false, materialDesignIcons: false }],
  ['nuxt-validate', { events: '' }],
  'nuxt-web3-provider'
]

export default {
  target: 'static',
  ssr: false,
  render: { resourceHints: false },
  /*
   ** Headers of the page
   */
  hooks: {
    'generate:page': (page) => {
      page.html = modifyHtml(page.html)
    },
    'render:route': (url, page, { req, res }) => {
      page.html = modifyHtml(page.html)
    }
  },
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    title: 'ERC20 Token Faucet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'An ERC20 token faucet on the Evmos Olympus mons testnet.'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ERC20 Faucet Dapp Smart Contract'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Get free ERC20 token on Evmos testnet network'
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://evmos-erc20.giansalex.dev'
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://academy-public.coinmarketcap.com/optimized-uploads/8d897958ce074c29b604b81b48669a90.png'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Get free ERC20 token on Evmos testnet network'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'Airdrop, ERC20 Evmos, free erc20, erc20 faucet, dapp, smart contract, decentralized, metamask'
      }
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel: 'icon', type: 'image/png', href: 'apple-touch-icon-180x180.png' },
      { rel: 'apple-touch-icon', href: 'apple-touch-icon-180x180.png' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:400,600,700'
      }
    ],
    script: [
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        async: ''
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#90ffbd' },

  loadingIndicator: {
    color: '#90ffbd',
    background: '#000403'
  },

  // ...routerBase,
  // router: {
  //   base: '/erc20faucet/'
  // },

  /*
   ** Global CSS
   */
  css: ['@/assets/styles/styles.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~/plugins/ads.js', ssr: false }],

  /*
   ** Nuxt.js modules
   */
  modules,

  providers: {
  },

  env: {
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
