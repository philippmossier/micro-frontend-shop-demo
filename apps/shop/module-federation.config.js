module.exports = {
  name: 'shop',
  exposes: {
    './Module': './src/shop-remote-entry.ts',
  },
  remotes: ['search'],
};
