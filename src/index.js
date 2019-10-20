const tokenizer = require('./tokenizer');
const ast = require('./ast');

module.exports = str => ast(tokenizer(str));
