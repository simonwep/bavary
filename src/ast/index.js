const declaration = require('./nodes/declaration');
const createStream = require('../stream');

/**
 * Converts a array of tokens into a ast-tree
 * @param tokens
 */
module.exports = tokens => {
    const stream = createStream(tokens);
    const declarations = [];

    while (stream.hasNext()) {
        const dec = declaration(stream);

        if (dec) {
            declarations.push(dec);
        } else {
            stream.throwError('Failed to parse declaration.');
        }
    }

    return declarations;
};
