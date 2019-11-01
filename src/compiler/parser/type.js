const multiplier = require('./multiplier');

module.exports = multiplier((stream, decl, scope, result) => {
    const group = require('./group');
    const block = require('./block');
    const {value} = decl;

    // Lookup parser
    if (!scope.has(value)) {
        throw `Cannot resolve ${value}`;
    }

    // Parse
    stream.stash();
    const body = scope.get(value);
    const exec = (body.type === 'block' ? block : group)(stream, body, scope);

    // Check if group returned smth
    if (exec !== null) {

        // Store result
        if (decl.tag) {
            result.pure = false; // Result is not anymore "just a string"
            result.obj[decl.tag] = exec; // Save tag-result TODO: Check if already declared
        } else if (Array.isArray(exec)) {
            result.str += exec.join(''); // Concat string sequences
        } else if (typeof exec === 'string') {
            result.str += exec;
        }

        stream.recycle();
        return true;
    } else if (decl.multiplier) {
        const {type} = decl.multiplier;

        // Declaration may containe a multiplier
        if (type === 'optional') {
            stream.recycle();
            return true;
        }
    }

    stream.pop();
    return false;
});
