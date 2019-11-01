const resolveScope = require('./tools/resolve-scope');
const typeValue = require('./parser/type-value');
const createStream = require('../stream');
const ast = require('../ast');

module.exports = definitions => {
    const tree = ast(definitions);
    let entry = null;

    // Resolve entities in the global scope
    const globals = resolveScope(tree, null, ({variant, name, value}) => {
        if (variant === 'entry') {

            // There can only be one entry type
            if (entry) {
                throw `There can only be one entry type. Got "${name}" as second one.`;
            }

            entry = value;
        }
    });

    // Check if entry node is declared
    if (!entry) {
        throw 'Couldn\'t resolve entry type. Use the entry keyword to declare one.';
    }

    return content => {
        const stream = createStream(content);
        const res = typeValue(stream, entry, globals);
        return stream.hasNext() ? null : res;
    };
};
