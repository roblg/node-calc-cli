function CalculatorParser(tokens) {
	this.tokens = tokens; // tokenize the expression
}

CalculatorParser.evaluate = function (expr) {
	var c = new CalculatorParser(expr);
	return CalculatorParser._eval(c.parse());
}

CalculatorParser._eval = function (node) {
	if (node.type === 'number') {
		return node.value;
	} else if (node.type === 'expr') {
		return this._eval(node.subtree);
	} else if (node.type === 'op') {
		var left = this._eval(node.left);
		var right = this._eval(node.right);
		switch (node.value) {
			case '*':
				return left * right;
			case '+':
				return left + right;
			case '-':
				return left - right;
			case '/':
				return left / right;
			default: throw 'Illegal: ' + node.value;
		}
	}
}

CalculatorParser.prototype.parse = function () {
	return this._parseHelper(this.tokens);
}

CalculatorParser.prototype._parseParenExpr = function (tokenArr) {
	return { type: 'expr', subtree: this._parseHelper(tokenArr) }
}

CalculatorParser.prototype._parseHelper = function (tokenArr) {

	// find first left paren. then find maching paren
	var lparen;
	do {
		lparen = tokenArr.indexOf('(');
		if (lparen > -1) {
			var rparen = this._findMatchingParen(tokenArr, lparen);
			var expr = this._parseParenExpr(tokenArr.slice(lparen+1, rparen));
			tokenArr.splice(lparen, rparen-lparen+1, expr);
		}
		// console.log(tokenArr);
	} while (lparen > -1);

	var ops = ["+", "-", "*", "/"];

	var i, // index into ops array
		tokenIdx; // index into tokens
	for (i = 0; i < ops.length; i++) {
		tokenIdx = tokenArr.indexOf(ops[i]);
		if (tokenIdx > -1) break;
	}

	if (tokenIdx > -1) {
		return {
			type: 'op', value: ops[i], 
			left: this._parseHelper(tokenArr.slice(0, tokenIdx)),
			right: this._parseHelper(tokenArr.slice(tokenIdx+1, tokenArr.length))
		};
	} else if (tokenArr.length === 1 && tokenArr[0].type === 'expr') {
		return tokenArr[0];
	} else if (tokenArr.length === 1 && /[0-9]+/.test(tokenArr[0])) {
		return { type: 'number', value: parseInt(tokenArr[0], 10) };
	}
	throw 'Unknown';
}

CalculatorParser.prototype._findMatchingParen = function (tokens, lparenIdx) {
	var parenStack = 1;
	var i = lparenIdx + 1;
	while (i < tokens.length && parenStack > 0) {
		if (tokens[i] === '(') {
			parenStack += 1;
		} else if (tokens[i] === ')') {
			parenStack -= 1;
		}
		i++;
	}
	// return i-1 because we advance i after doing comparisons
	if (parenStack === 0) return i - 1;
	else throw 'No matching paren';
}

module.exports = CalculatorParser;