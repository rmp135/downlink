module.exports = {
  router: { base: '/downlink' },
  plugins: [
    '~plugins/TickerPlugin'
  ],
  css: [{ src: '~assets/theme.scss', lang: 'scss' }],
  loading: false
}