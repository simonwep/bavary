const ParsingError = require('./misc/parsing-error');
const prettyPrintError = require('./utils/pretty-print-error');
const tokenizer = require('./tokenizer');
const ast = require('./ast');

module.exports = str => {
    try {
        return ast(tokenizer(str));
    } catch (e) {
        if (e instanceof ParsingError) {
            prettyPrintError(str, e);
        } else {
            throw e;
        }
    }
};
