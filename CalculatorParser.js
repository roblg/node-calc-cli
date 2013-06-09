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
	} else if (node.type === 'pow') {
		return Math.pow( this._eval(node.left), this._eval(node.right) );
	} else if (node.type === 'funcCall') {
		return Math[node.funcName].apply(null, node.args.map(this._eval, this));
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

CalculatorParser.prototype._handleFuncCalls = function (tokenArr) {
	var funcCallIdx;
	do {
		funcCallIdx = this._indexOfFuncName(tokenArr);
		if (funcCallIdx > -1) {
			var lparen = funcCallIdx + 1;
			var rparen = this._findMatchingParen(tokenArr, lparen);
			var funcCallExpr = {
				type: 'funcCall',
				funcName: tokenArr[funcCallIdx],
				args: this._parseFunctionArgs(tokenArr.slice(lparen+1,rparen))
			};
			tokenArr.splice(funcCallIdx, rparen-funcCallIdx+1, funcCallExpr);
		}
	} while (funcCallIdx > -1);
}

CalculatorParser.prototype._parseFunctionArgs = function (tokenArr) {
	var parenDepth = 0,
		argTokenArrays = [],
		temp = [];
	for (var i = 0; i < tokenArr.length; i++) {
		if (tokenArr[i] === ',' && parenDepth === 0) {
			argTokenArrays.push(temp);
			temp = [];
		} else {
			if (tokenArr[i] === '(') {
				parenDepth += 1;
			} else if (tokenArr[i] === ')') {
				parenDepth -= 1;
			}
			temp.push(tokenArr[i]);
		}
	}
	if (temp.length > 0) {
		argTokenArrays.push(temp);
	}

	return argTokenArrays.map(function (tokens) {
		return this._parseHelper(tokens);
	}, this);
}

CalculatorParser.prototype._indexOfFuncName = function (tokenArr) {
	for (var i = 0; i < tokenArr.length; i++) {
		if (/^[a-z]+$/.test(tokenArr[i])) {
			return i;
		}
	}
	return -1;
}

CalculatorParser.prototype._parseHelper = function (tokenArr) {

	this._handleFuncCalls(tokenArr);

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

	var powIdx;
	do {
		powIdx = tokenArr.indexOf('**');
		// at this point we know that parentheses have been evaluated, so 
		// we can just look at the token before and after the '**'
		if (powIdx > -1) {
			var powExpr = { 
				type: 'pow', 
				left: this._parseHelper([ tokenArr[powIdx-1] ]), 
				right: this._parseHelper([ tokenArr[powIdx+1] ])
			};
			tokenArr.splice(powIdx - 1, 3, powExpr);
		}
	} while (powIdx > -1);

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
	} else if (tokenArr.length === 1 && ["expr", "pow", "funcCall"].indexOf(tokenArr[0].type) > -1) {
		return tokenArr[0];
	} else if (tokenArr.length === 1 && /[0-9]+/.test(tokenArr[0])) {
		return { type: 'number', value: parseInt(tokenArr[0], 10) };
	}
	throw 'Unknown: ' + JSON.stringify(tokenArr);
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