
var readline = require("readline"),
	CalculatorLexer = require("./CalculatorLexer"),
	CalculatorParser = require("./CalculatorParser");


var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.setPrompt('? ');
rl.prompt();

rl.on('line', function (line) {
	var tokens = new CalculatorLexer(line.trim()).tokenize();
	console.log("=> ", CalculatorParser.evaluate(tokens));
	rl.prompt();
}).on('SIGINT', function () {
	rl.close();
}).on('close', function () {
	console.log('Have a great day!');
	process.exit(0);
});

