import { expect } from 'chai';
import add from './index.js';

describe('add function', () => {
  it('should return 5 when adding 2 and 3', () => {
    expect(add(2, 10)).to.equal(12);
  });
});
