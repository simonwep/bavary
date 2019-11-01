const createStream = require('../stream');
const ast = require('../ast');
const group = require('./parser/group');
const block = require('./parser/block');

module.exports = definitions => {
    const tree = ast(definitions);
    let entry = null;

    // Create map of declarations
    const globals = new Map();
    for (const {name, value, type, variant} of tree) {

        // Each declaration can only one get once defined
        if (globals.has(name)) {
            throw `Type ${name} has been already declared.`;
        } else if (type === 'declaration') {

            if (variant === 'entry') {

                // There can only be one entry type
                if (entry) {
                    throw `There can only be one entry type. Got ${name} as second one.`;
                }

                entry = value;
            }

            globals.set(name, value);
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
        const res = (entry.type === 'block' ? block : group)(stream, entry, globals);
        return stream.hasNext() ? null : res;
    };
};
