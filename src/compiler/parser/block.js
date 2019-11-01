const multiplier = require('./multiplier');
const group = require('./group');

module.exports = multiplier((stream, decl, scope) => {

    // Inherit current scope
    const newScope = new Map([...scope]);
    let def = null;

    // Load new types
    for (const {name, value, type, variant} of decl.value) {

        // Each declaration can only one get once defined
        if (newScope.has(name)) {
            throw `Type ${name} has been already declared. Avoid using the same name multiple times.`;
        } else if (type === 'declaration') {

            if (variant === 'default') {
                if (def !== null) {
                    throw 'There can only be one default export.';
                }

                def = value;
            } else if (variant === 'entry') {
                throw 'The entry type needs to be in the global scope.';
            }

            // Check if declaration isn't anonym
            if (name !== null) {
                newScope.set(name, value);
            }
        } else {
            throw `Unknown type: ${type}`;
        }
    }

    if (!def) {
        throw 'Missing default export.';
    }


    return group(stream, def, newScope);
});
