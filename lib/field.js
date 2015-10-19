'use strict';

var assert = require('assert');

var BitField = require('bitfield.js');

function HField(size, pageSize) {
  this.pageSize = pageSize;
  this.pages = new Array(Math.ceil(size / this.pageSize));
  for (var i = 0; i < this.pages.length; i++)
    this.pages[i] = null;
}
module.exports = HField;

HField.create = function create(size, pageSize) {
  return new HField(size, pageSize);
};

HField.prototype.grow = function grow(size) {
  var len = Math.ceil(size / this.pageSize);
  while (this.pages.length < len)
    this.pages.push(null);
};

HField.prototype.set = function set(index) {
  var i = (index / this.pageSize) | 0;
  var j = (index % this.pageSize) | 0;

  if (this.pages[i] === null)
    this.pages[i] = new BitField(this.pageSize);
  return this.pages[i].set(j);
};

HField.prototype.check = function check(index) {
  var i = (index / this.pageSize) | 0;
  var j = (index % this.pageSize) | 0;

  if (this.pages[i] === null)
    return false;

  return this.pages[i].check(j);
};

HField.prototype.clear = function clear(index) {
  var i = (index / this.pageSize) | 0;
  var j = (index % this.pageSize) | 0;

  if (this.pages[i] === null)
    return;

  return this.pages[i].clear(j);
};

HField.prototype.wipe = function wipe() {
  for (var i = 0; i < this.pages.length; i++)
    this.pages[i] = null;
};

HField.prototype.or = function or(other) {
  assert.equal(other.pageSize, this.pageSize, 'Page size should be equal');

  var len = Math.min(this.pages.length, other.pages.length);
  for (var i = 0; i < len; i++) {
    if (other.pages[i] === null)
      continue;

    if (this.pages[i] === null)
      this.pages[i] = other.pages[i].clone();
    else
      this.pages[i].or(other.pages[i]);
  }

  for (; i < other.pages.length; i++) {
    var page = other.pages[i];
    if (page === null)
      this.pages.push(null);
    else
      this.pages.push(page.clone());
  }
};
