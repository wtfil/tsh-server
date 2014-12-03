var MAX_RULE_TRY = 5;

function escapeBash(text) {
	return text
		.split('\n')
		.map(escapeLine)
		.join('\n');
}

function escapeLine(text) {
	return [backspace]
		.reduce(function (text, rule) {
			return runRule(text, rule);
		}, text);
}

function runRule(text, rule) {
	var tryes = MAX_RULE_TRY;
	var prev;
	var curr;
	while (!curr || prev !== curr) {
		prev = curr || text;
		curr = rule(prev);
		if (! --tryes) {
			console.warn('Potencial error at "' + text + '"');
			break;
		}
	}
	return curr;
}

function backspace(text) {
	var re = /\x07?(\x08+)(\x1b\x5b(?:\x4b|\d+\x50))?/;
	var match = text.match(re);
	var index, count, total;
	if (!match) {
		return text;
	}
	index = match.index;
	removed = match[1].length;
	total = match[0].length;

	return text.substring(0, index - removed) +
		text.substring(index + total);
}

module.exports = escapeBash;
