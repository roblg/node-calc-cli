
var EOF = -1;

function CalculatorLexer(input) {
	this.input = input;
	this.c = input[0];
	this.p = 0;
	this.tokens = [];
}

CalculatorLexer.prototype.tokenize = function () {
	while (this.c !== EOF) {

		while (/\s/.test(this.c)) {
			this.consume();
		}

		if (this.c === '(' || this.c === ')') {
			this.emit(this.c);
		} else if (this.c === '+' || this.c === '/') {
			this.emit(this.c);
		} else if (this.c === '*') {
			if (this.input[this.p + 1] === '*') {
				this.tokens.push('**');
				this.consume();
				this.consume();
			} else {
				this.emit('*');
			}
		} else if (this.c === '-') {
			if (this.isNumber(this.input[this.p + 1])) {
				// this is a negative number
				this.number();
			} else {
				this.emit('-');
			}
		} else if (this.isNumber(this.c)) {
			this.number();
		} else {
			throw 'Illegal: ' + this.c;
		}
	}

	return this.tokens;
}

CalculatorLexer.prototype.isNumber = function (d) {
	return /^[0-9]$/.test(d);
}

CalculatorLexer.prototype.number = function () {
	var result = [];
	// allow negatives at the front only
	if (this.c === '-') {
		result.push('-');
		this.consume();
	}

	do {
		result.push(this.c);
		this.consume();
	} while (this.isNumber(this.c));

	this.tokens.push(result.join(''));
}

CalculatorLexer.prototype.emit = function (token) {
	this.tokens.push(token);
	this.consume();
}

CalculatorLexer.prototype.consume = function () {
	this.p++;
	if (this.p < this.input.length) { this.c = this.input[this.p]; }
	else { this.c = EOF; }
}

module.exports = CalculatorLexer;