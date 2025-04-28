// test.js
const { expect } = require('chai');
const { add } = require('./index');

describe('add', () => {
  it('should return 5', () => expect(add(2, 3)).to.equal(5));  // This will pass
});
