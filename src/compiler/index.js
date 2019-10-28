const createStream = require('../stream');
const ast = require('../ast');
const group = require('./parser/group');

module.exports = definitions => {
    const tree = ast(definitions);
    let entry = null;

    // Create map of declarations
    const declarations = new Map();
    for (const {name, value, type, variant} of tree) {

        // Each declaration can only one get once defined
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
