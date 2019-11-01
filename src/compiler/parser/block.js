const resolveScope = require('../tools/resolve-scope');
const group = require('./group');

module.exports = (stream, decl, scope) => {

    // Inherit current scope
    let def = null;
    const newScope = resolveScope(decl.value, scope, ({variant, value}) => {
        if (variant === 'default') {
            if (def !== null) {
                throw 'There can only be one default export.';
            }

            def = value;
        } else if (variant === 'entry') {
            throw 'The entry type needs to be in the global scope.';
        }
    });

    if (!def) {
        throw 'Missing default export.';
    }

    return group(stream, def, newScope);
};
