module.exports = {
  router: { base: '/downlink' },
  plugins: [
    '~plugins/TickerPlugin'
  ],
  css: [
    { src: '~assets/theme.scss', lang: 'scss' },
    { src: '~/node_modules/font-awesome/scss/font-awesome.scss', lang: 'scss'}
  ],
  loading: false
}