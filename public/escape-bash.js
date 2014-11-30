function escapeBash(text) {
	return text
		.split('\n')
		.map(escapeLine)
		.join('\n');
}

function runRule(text, rule) {
	var prev;
	var curr;
	while (!curr || prev !== curr) {
		prev = curr || text;
		curr = rule(prev);
	}
	return curr;
}

function escapeLine(text) {
	return [backspace]
		.reduce(function (text, rule) {
			return runRule(text, rule);
		}, text);
}

function backspace(text) {
	var re = /\x08\x1b\[K/;
	var match = text.match(re);
	return match ?
		(text.substring(0, match.index - 1) + text.substring(match.index + 4)) :
		text;
}

module.exports = escapeBash;
