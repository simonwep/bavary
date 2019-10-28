const declaration = require('./nodes/declaration');
const tokenize = require('../tokenizer');
const createStream = require('../stream');

/**
 * Converts a array of tokens into a ast-tree
 * @param defs
 */
module.exports = defs => {
    const stream = createStream(tokenize(defs), defs);
    const declarations = [];

    while (stream.hasNext()) {
        const dec = declaration(stream);

        if (dec) {
            declarations.push(dec);
        } else {
            return stream.throwError('Expected type-declaration.');
        }
    }

    return declarations;
};
