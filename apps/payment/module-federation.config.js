module.exports = {
  name: 'payment',
  exposes: {
    './Module': './src/payment-remote-entry.ts',
  },
};
