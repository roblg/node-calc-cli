/*

// TODO: this is broken

expr * expr | expr + expr

expr :  multiply_helper expr | NUM plus_helper | ( expr ) | NUM
multiply_helper: NUM '*' | NUM plus_helper | '(' plus_helper ')

plus_helper: '+' expr

OP: '+' | '*'
NUM: \d+

*/

var EOF = -1;

function Parser(lexer) {
	this.lexer = lexer;
	this.current = this.lexer.nextToken();
}

Parser.prototype.parse = function () {	
	this.expr();
	this.consume('EOF');
}

Parser.prototype.expr = function () {
	switch (this.current.type) {
		case 'NUMBER':
			this.consume('NUMBER');
			if (this.current.type === 'OPERATOR') {
				this.operatorHelper();
			}
			break;
		case 'LPAREN':
			this.consume('LPAREN');
			this.expr();
			this.consume('RPAREN');
			break;
		default: throw 'Unexpected token: ' + this.current.type;
	}
}

Parser.prototype.operatorHelper = function () {
	var op = this.current.value;
	this.consume('OPERATOR');
	this.expr();
}

Parser.prototype.consume = function (expectedTokenType) {
	console.log("Consuming...", expectedTokenType);
	if (expectedTokenType === this.current.type) {
		this.current = this.lexer.nextToken();
	} else {
		throw 'Unexpected token: ' + this.current.type;
	}
}





function Lexer(input) {
	this.input = input;
	this.pos = 0;
	this.c = this.input[this.pos];
}

Lexer.prototype.nextToken = function () {
	while (this.c === ' ') {
		this.consume();
	}
	
	if (this.isNumber(this.c)) {
		return this.NUMBER();
	} else if (this.c === '+' || this.c === '*') {
		return this.OP();
	} else if (this.c === '(') {
		this.consume();
		return { type: 'LPAREN' };
	} else if (this.c === ')') {
		this.consume();
		return { type: 'RPAREN' };
	} else if (this.c === EOF) {
		return { type: 'EOF' };
	} else {
		console.log(JSON.stringify(this));
		throw 'Unexpected';
	}
}

Lexer.prototype.NUMBER = function () {
	var buffer = [];
	do {
		buffer.push(this.c);
		this.consume();
	} while (this.isNumber(this.c));
	return { type: 'NUMBER', value: buffer.join('') };
}

Lexer.prototype.OP = function () {
	var ret = { type: 'OPERATOR', value: this.c };
	this.consume();
	return ret;
}

Lexer.prototype.isNumber = function (c) {
	return /^[0-9]$/.test(c);
}

Lexer.prototype.consume = function () {
	this.pos++;
	if (this.pos === this.input.length) { this.c = EOF; }
	else { this.c = this.input[this.pos]; }
}


var lexer = new Lexer('3 + 3 * 3'); // 3 * 3 + 3
var parser = new Parser(lexer);

parser.parse();

