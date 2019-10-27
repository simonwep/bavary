const ParsingError = require('../misc/parsing-error.js');
const prettyPrintError = require('../utils/pretty-print-error.js');
const createStream = require('../stream');
const tokenizer = require('../tokenizer');
const ast = require('../ast');
const group = require('./parser/group');

module.exports = definitions => {
    let tree = null;
    let entry = null;

    // Try to parse definitions
    try {
        tree = ast(tokenizer(definitions));
    } catch (e) {

        // TODO: Make message of ParsingError a pretty-error?!
        if (e instanceof ParsingError) {
            return prettyPrintError(definitions, e);
        }

        throw e;
    }

    // Create map of declarations
    const declarations = new Map();
    for (const {name, value, type, variant} of tree) {
        if (declarations.has(name)) {
            throw `Type ${name} has been already declared.`;
        } else if (type === 'declaration') {

            if (variant === 'entry') {

                // There can only be one entry type
                if (entry) {
                    throw `There can only be one entry type. Got ${name} as second one.`;
                }

                entry = value;
            }

            declarations.set(name, value);
        } else {
            throw `Unknown type: ${type}`;
        }
    }

    // Check if entry node is declared
    if (!entry) {
        throw 'Couldn\'t resolve entry type. Use the entry keyword to declare one.';
    }

    return content => {
        const stream = createStream(content);
        const res = group(stream, entry, declarations);
        return stream.hasNext() ? null : res;
    };
};
