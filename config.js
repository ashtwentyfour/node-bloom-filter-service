require('dotenv').config();

const {AssertionError} = require('assert');
const assert = require('assert');

if (process.env.N_ITEMS != null ||
    process.env.N_ITEMS != null) { // validate user input parameters
  try {
    assert(process.env.N_ITEMS == null || process.env.N_ITEMS >= 20);
    assert(process.env.F_PROB == null || process.env.F_PROB >= 0.01);
  } catch (e) {
    if (e instanceof AssertionError) {
      console.error('no. of items must be >= 20 and ' +
                'false +ve probability >= 0.01');
    } else {
      console.error(e);
    }
    process.exit(1);
  }
}

const config = {
  'n_item': process.env.N_ITEMS || 100000,
  'f_prob': process.env.F_PROB || 0.05,
};

module.exports = config;
