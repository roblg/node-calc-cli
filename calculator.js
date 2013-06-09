
var readline = require("readline"),
	CalculatorLexer = require("./CalculatorLexer"),
	CalculatorParser = require("./CalculatorParser");


var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.setPrompt('? ');
rl.prompt();

var debug = (process.argv.slice(2).indexOf('-debug') > -1);
var env = {}; // holds variable values

rl.on('line', function (line) {
	try {
		var tokens = new CalculatorLexer(line.trim()).tokenize();
		if (debug) {
			console.log("=> ", new CalculatorParser(tokens, env).parse());
		}
		console.log("=> ", CalculatorParser.evaluate(tokens, env));
	} catch (e) {
		console.log("Error:", e);
	}
	rl.prompt();
}).on('SIGINT', function () {
	rl.close();
}).on('close', function () {
	console.log('Have a great day!');
	process.exit(0);
});


