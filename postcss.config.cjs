module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'blob-radius': '999px',
        'glass-blur': 'blur(18px)',
        'teal-glow': 'rgba(20, 184, 166, 0.18)',
        'cyan-glow': 'rgba(56, 189, 248, 0.15)',
        'hero-gradient':
          'linear-gradient(135deg, rgba(6, 95, 70, 0.96) 0%, rgba(13, 148, 136, 0.94) 45%, rgba(8, 145, 178, 0.92) 100%)',
        'page-gradient-light':
          'linear-gradient(180deg, rgba(241, 250, 248, 0.96) 0%, rgba(232, 245, 255, 0.9) 45%, rgba(248, 250, 252, 1) 100%)',
        'auth-gradient-light':
          'linear-gradient(135deg, rgba(239, 246, 255, 1) 0%, rgba(236, 253, 245, 0.98) 46%, rgba(248, 250, 252, 1) 100%)',
        'overlay-white-glass': 'rgba(255, 255, 255, 0.82)',
        'overlay-white-subtle': 'rgba(255, 255, 255, 0.14)',
        'overlay-white-dim': 'rgba(255, 255, 255, 0.12)',
        'overlay-dark-glass': 'rgba(8, 15, 24, 0.3)',
      },
    },
  },
}
