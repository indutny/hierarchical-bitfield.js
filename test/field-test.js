var assert = require('assert');

var hbitfield = require('../');

describe('Hierarchical bitfield.js', function() {
  it('should support very large fields', function() {
    var b = hbitfield.create(1024 * 1024, 1024);
    b.set(318000);
    assert(b.check(318000));
    assert(!b.check(318001));
  });
});
