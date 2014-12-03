var escapeBash = require('./lib/escape-bash');
var assert = require('assert');

describe('escape bash', function () {
	it('ls <backspace> l', function () {
		assert.equal(escapeBash('ls\x08\x1b\x5b\x4bl'), 'll');
	});
	it('ll <ctrl-u> du', function () {
		assert.equal(escapeBash('ll\x08\x08\x1b\x5b\x4bdu'), 'du');
	});
	it('ls <enter> ll <up>', function () {
		assert.equal(escapeBash('ll\x08\x08\x1b\x5b\x4bdu'), 'du');
	});

	it('ll <enter> asd <up>', function () {
		// 31 - "1", 50 - "P"
		assert.equal(escapeBash('asd\x08\x08\x08\x1b\x5b\x31\x50ll'), 'll');
	});
});
