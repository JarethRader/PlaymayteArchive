module.exports = {
  important: true,
  purge: ['./src/**/*.ts', './src/**/*.tsx', './src/**/*.js', './src/**/*.jsx'],
  theme: {
    container: {
      center: true,
      paddingTop: '2rem',
      paddingBottom: '2rem',
    },
    // colors: {
    //   purple: "#4a3057",
    //   white: "#fff",
    //   black: "#000",
    // },
    minHeight: {
      '0': '0',
      '1/10': '10%',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      '4/5': '80vh',
      '9/10': '90%',
      full: '100%',
      screen: '100vh',
    },
    maxHeight: {
      '1/4': '25%',
      '3/8': '37.5%',
      '1/2': '50%',
      '5/8': '62.5%',
      '3/4': '75%',
      '7/8': '87.5%',
      '9/10': '90%',
      full: '100%',
    },
    maxWidth: {
      '1/4': '25%',
      '3/8': '37.5%',
      '1/2': '50%',
      '5/8': '62.5%',
      '3/4': '75%',
      '7/8': '87.5%',
      full: '100%',
    },
    extend: {
      gridTemplateRows: {
        '8': 'repeat(8, minmax(0, 1fr))',
        layout: 'repeat(auto-fill, minmax(min(10rem, 100%), 1fr))',
      },
    },
  },
  variants: {},
  plugins: [],
};
